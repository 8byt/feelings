package api

import (
	"database/sql"
	"feelings/server/util"
	"github.com/gin-gonic/gin"
	"net/http"
)

func (e *ApiEnv) HandleGetFeed(c *gin.Context) {
	posts, err := e.DbEnv.GetPosts(sql.NullInt64{})
	if err != nil {
		util.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
	})
}
