package api

import (
	"feelings/server/database"
	"feelings/server/util"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func (e *ApiEnv) HandleAddPost(c *gin.Context) {
	var addPostReq database.ReqAddPost
	if err := c.ShouldBind(&addPostReq); err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	dupeExists, err := e.DbEnv.CheckDuplicateReaction(addPostReq.FeelingId, addPostReq.ParentId)
	if dupeExists {
		c.Status(http.StatusNoContent)
	}

	latestPost, err := e.DbEnv.GetLatestPost(addPostReq.UserId)
	now := time.Now()
	then := time.Unix(int64(latestPost.TimeAdded / 1000), int64(latestPost.TimeAdded) % 1000 * 1e6)

	if latestPost.FeelingId == addPostReq.FeelingId && now.Before(then.Add(time.Hour)) && addPostReq.ParentId == 0 {
		_, err := e.DbEnv.IncrementPostCount(latestPost.PostId)
		if err != nil {
			util.SendError(c, http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"post_id": latestPost.PostId,
		})
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
