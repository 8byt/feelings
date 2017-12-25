package database

import (
	"feelings/server/types"
	"feelings/server/util"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"

	_ "database/sql"
)

func (e *Env) HandleAddUser(c *gin.Context) {
	name := c.Query("name")
	email := c.Query("email")

	if len(name) < 2 {
		util.SendError(c, http.StatusBadRequest, "name not long enough")
		return
	}
	if len(email) == 0 {
		util.SendError(c, http.StatusBadRequest, "no email specified")
		return
	} else if len(strings.Split(email, "@")) != 2 {
		util.SendError(c, http.StatusBadRequest, "email invalid")
		return
	}
	var userId int64 = 0
	err := e.db.QueryRow(
		`INSERT INTO "user"("name", "email") VALUES ($1, $2) RETURNING "user_id"`,
		name,
		email,
	).Scan(&userId)
	if err != nil {
		fmt.Println(err)
		util.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(200, gin.H{
		"user_id": userId,
	})
}

func (e *Env) GetUsers() ([]*types.User, error) {
	rows, err := e.db.Query(
		`SELECT user_id, "name" FROM "user"`,
	)
	if err != nil {
		return []*types.User{}, err
	}
	defer rows.Close()

	var users []*types.User

	for rows.Next() {
		var dbUser types.DbUser
		err = rows.Scan(&dbUser.UserId, &dbUser.Name)
		if err != nil {
			return []*types.User{}, err
		}
		users = append(users, &types.User{
			Id:      dbUser.UserId,
			Email:   "",
			Name:    dbUser.Name,
			Friends: nil, // NOTE(danny): nil means specifically that this data has been redacted
		})
	}

	return users, nil
}

func (e *Env) GetFriends(userId int64) []*types.User {
	return []*types.User{}
}

type GetFriends struct {
	UserId int64 `form:"user_id" binding:"required"`
}

func (e *Env) HandleGetFriends(c *gin.Context) {
	var getFriends GetFriends
	if err := c.ShouldBind(&getFriends); err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	friends, err := e.GetUsers() // TODO(danny): use e.GetFriends(getFriends.UserId),
	if err != nil {
		util.SendError(c, 500, err.Error())
		return
	}

	c.JSON(200, gin.H{
		"friends": friends,
	})
}
