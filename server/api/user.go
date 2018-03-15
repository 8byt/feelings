package api

import (
	"feelings/server/util"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
	"feelings/server/types"
)

func (e *ApiEnv) HandleAddUser(c *gin.Context) {
	var newUser types.NewUser

	if err := c.ShouldBind(&newUser); err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if len(newUser.Name) < 2 {
		util.SendError(c, http.StatusBadRequest, "name not long enough")
		return
	}
	if len(newUser.Email) == 0 {
		util.SendError(c, http.StatusBadRequest, "no email specified")
		return
	} else if len(strings.Split(newUser.Email, "@")) != 2 {
		util.SendError(c, http.StatusBadRequest, "email invalid")
		return
	}
	userId, err := e.DbEnv.AddUser(newUser)
	if err != nil {
		fmt.Println(err)
		util.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"user_id": userId,
	})
}

func (e *ApiEnv) HandleGetCurrentUser(c *gin.Context) {
	userId := util.GetUserId(c)
	user, err := e.DbEnv.GetUserById(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No user found.",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"currentUser": user,
		})
	}
}
