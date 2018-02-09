package api

import (
	"feelings/server/database"
	"feelings/server/util"
	"github.com/gin-gonic/gin"
	"net/http"
)

func (e *ApiEnv) HandleAddPost(c *gin.Context) {
	var addPostReq database.ReqAddPost
	if err := c.ShouldBind(&addPostReq); err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	postId, err := e.DbEnv.AddPost(addPostReq)

	if err != nil {
		util.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"post_id": postId,
	})
}
