package database

import (
	"database/sql"
	"feelings/server/util"
	"github.com/gin-gonic/gin"
)

func (e *Env) HandleGetFeed(c *gin.Context) {
	posts, err := e.GetPosts(sql.NullInt64{})
	if err != nil {
		util.SendError(c, 500, err.Error())
		return
	}
	c.JSON(200, gin.H{
		"posts": posts,
	})
}
