package api

import (
	"feelings/server/util"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func (e *ApiEnv) HandleAddUser(c *gin.Context) {
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
	userId, err := e.DbEnv.AddUser(name, email)
	if err != nil {
		fmt.Println(err)
		util.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user_id": userId,
	})
}
