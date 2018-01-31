package database

import (
	"fmt"

	_ "database/sql"
	"errors"
	"feelings/server/types"
)

type DbFriendRequest struct {
	SrcUserId  int64
	DestUserId int64
	Accepted   bool
}

func (e *Env) MaybeGetFriendRequest(srcUserId int64, destUserId int64) *DbFriendRequest {
	friendReq := DbFriendRequest{}
	row := e.Db.QueryRow(
		`SELECT src_user_id, dest_user_id, accepted FROM friendship WHERE src_user_id = $1 AND dest_user_id = $2`,
		srcUserId,
		destUserId,
	)
	err := row.Scan(&friendReq.SrcUserId, &friendReq.DestUserId, &friendReq.Accepted)

	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	return &friendReq
}

func (e *Env) AddFriendRequest(srcUserId int64, destUserId int64) error {
	if srcUserId == destUserId {
		return errors.New("can't be your own friend, sorry")
	}
	// check for existing friend request
	maybeFriendRequest := e.MaybeGetFriendRequest(srcUserId, destUserId)
	if maybeFriendRequest != nil {
		return errors.New("friend already requested")
	}
	// TODO(danny): handle weird cases
	_, err := e.Db.Exec(
		`INSERT INTO "friendship"(src_user_id, dest_user_id, accepted) VALUES ($1, $2, $3)`,
		srcUserId,
		destUserId,
		false,
	)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func (e *Env) ConfirmFriend(srcUserId int64, destUserId int64) error {
	// TODO(danny): better handling of multiple calls to confirm
	maybeBackLink := e.MaybeGetFriendRequest(destUserId, srcUserId)
	if maybeBackLink == nil {
		return errors.New("can't confirm unrequested friendship")
	}
	tx, err := e.Db.Begin()
	// add accept
	_, err = tx.Exec(
		`INSERT INTO "friendship"(src_user_id, dest_user_id, accepted) VALUES ($1, $2, $3)`,
		srcUserId,
		destUserId,
		true,
	)
	if err != nil {
		fmt.Println(err)
		tx.Rollback()
		return err
	}
	// set back link to accepted
	_, err = tx.Exec(
		`UPDATE "friendship" SET accepted = TRUE WHERE src_user_id = $1 AND dest_user_id = $2`,
		destUserId,
		srcUserId,
	)

	if err != nil {
		fmt.Println(err)
		tx.Rollback()
		return err
	}
	return tx.Commit()
}

func (e *Env) GetPendingFriends(destUserId int64) ([]*types.MiniUser, error) {
	rows, err := e.Db.Query(
		`SELECT "user_id", "name" FROM "user"
		JOIN "friendship" ON "user".user_id = "friendship".src_user_id
		WHERE "friendship".dest_user_id = $1 AND "friendship".accepted = FALSE`,
		destUserId,
	)
	if err != nil {
		return []*types.MiniUser{}, err
	}
	defer rows.Close()

	var users []*types.MiniUser

	for rows.Next() {
		var miniUser types.MiniUser
		err = rows.Scan(&miniUser.UserId, &miniUser.Name)
		if err != nil {
			return []*types.MiniUser{}, err
		}
		users = append(users, &miniUser)
	}

	return users, nil
}

func (e *Env) GetFriends(userId int64) ([]*types.MiniUser, error) {
	rows, err := e.Db.Query(
		`SELECT user_id, "name" FROM "friendship"
		JOIN "user" ON "user".user_id = "friendship".dest_user_id
		WHERE "friendship".src_user_id = $1 AND "friendship".accepted = TRUE`,
		userId,
	)
	if err != nil {
		return []*types.MiniUser{}, err
	}
	defer rows.Close()

	var users []*types.MiniUser

	for rows.Next() {
		var miniUser types.MiniUser
		err = rows.Scan(&miniUser.UserId, &miniUser.Name)
		if err != nil {
			return []*types.MiniUser{}, err
		}
		users = append(users, &miniUser)
	}

	return users, nil
}
