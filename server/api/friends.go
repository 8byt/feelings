package api

import (
	"feelings/server/util"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func (e *ApiEnv) HandleGetFriends(c *gin.Context) {
	userId := util.GetUserId(c)
	if userId <= 0 {
		util.SendError(c, http.StatusBadRequest, "UserId invalid")
		return
	}

	fmt.Println(userId)

	friends, err := e.DbEnv.GetFriends(userId)
	if err != nil {
		util.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"friends": friends,
	})
}

func (e *ApiEnv) HandleGetPendingFriends(c *gin.Context) {
	userId := util.GetUserId(c)
	if userId <= 0 {
		util.SendError(c, http.StatusBadRequest, "UserId invalid")
		return
	}

	pendingFriends, err := e.DbEnv.GetPendingFriends(userId)
	if err != nil {
		util.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"pendingFriends": pendingFriends,
	})
}

type ReqAddFriend struct {
	DestUserId int64 `json:"destUserId" binding:"required"`
}

func (e *ApiEnv) HandleAddFriend(c *gin.Context) {
	var reqAddFriend ReqAddFriend
	if err := c.ShouldBind(&reqAddFriend); err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	userId := util.GetUserId(c)
	if userId <= 0 {
		util.SendError(c, http.StatusBadRequest, "UserId invalid")
		return
	}

	err := e.DbEnv.AddFriendRequest(userId, reqAddFriend.DestUserId)
	if err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
}

type ReqConfirmFriend struct {
	DestUserId int64 `json:"destUserId" binding:"required"`
}

func (e *ApiEnv) HandleConfirmFriend(c *gin.Context) {
	var reqConfirmFriend ReqConfirmFriend
	if err := c.ShouldBind(&reqConfirmFriend); err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	userId := util.GetUserId(c)
	if userId <= 0 {
		util.SendError(c, http.StatusBadRequest, "UserId invalid")
		return
	}

	err := e.DbEnv.ConfirmFriend(userId, reqConfirmFriend.DestUserId)
	if err != nil {
		fmt.Println(err.Error())
		util.SendError(c, http.StatusInternalServerError, "Failed to confirm")
		return
	}
}
