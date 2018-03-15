package database

import (
	_ "database/sql"
	"feelings/server/types"
	"log"
	"github.com/lib/pq"
)

func (e *Env) GetUserByEmail(userEmail string) (*types.User, error) {
	var user types.User
	err := e.Db.QueryRow(
		`SELECT user_id, name, email FROM "user" WHERE "email" = $1`,
		userEmail,
	).Scan(&user.Id, &user.Name, &user.Email)
	if err != nil {
		return &types.User{}, err
	}

	return &user, nil
}

func (e *Env) GetUserById(userId int64) (*types.User, error) {
	var user types.User
	err := e.Db.QueryRow(
		`SELECT user_id, name, email, CAST(EXTRACT(EPOCH FROM time_joined) AS bigint) * 1000
			FROM "user" WHERE "user_id" = $1`,
		userId,
	).Scan(&user.Id, &user.Name, &user.Email, &user.TimeJoined)
	if err != nil {
		return &types.User{}, err
	}

	return &user, nil
}

func (e *Env) CheckAuthentication(userEmail string) (int64, bool) {
	user, err := e.GetUserByEmail(userEmail)
	if err != nil {
		return -1, false
	}
	return user.Id, true
}

func (e *Env) AddUser(user types.NewUser) (int64, error) {
	var userId int64 = 0
	err := e.Db.QueryRow(
		`INSERT INTO "user"("name", "email") VALUES ($1, $2) RETURNING "user_id"`,
		user.Name,
		user.Email,
	).Scan(&userId)

	return userId, err
}

func (e *Env) GetUsers() ([]*types.MiniUser, error) {
	rows, err := e.Db.Query(
		`SELECT user_id, "name" FROM "user"`,
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

func (e *Env) GetUsersById(userIds pq.Int64Array) ([]*types.MiniUser, error) {
	rows, err := e.Db.Query(
		`SELECT "user_id", "name" FROM "user" WHERE "user_id" = ANY($1)`,
		userIds,
	)
	if err != nil {
		log.Println(err)
		return []*types.MiniUser{}, err
	}
	defer rows.Close()

	var users []*types.MiniUser

	for rows.Next() {
		var miniUser types.MiniUser
		err = rows.Scan(&miniUser.UserId, &miniUser.Name)
		if err != nil {
			log.Println(err)
			return []*types.MiniUser{}, err
		}
		users = append(users, &miniUser)
	}

	return users, nil
}
