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
	var userMap = make(map[int64]int)

	// accumulate seen user ids, count the number of times for fun
	for _, post := range posts {
		count, ok := userMap[post.UserId]
		if !ok {
			userMap[post.UserId] = 1
		} else {
			userMap[post.UserId] = count + 1
		}
	}
	// get keys of the map
	seenUserIds := make([]int64, 0, len(userMap))
	for k := range userMap {
		seenUserIds = append(seenUserIds, k)
	}
	seenUsers, err := e.DbEnv.GetUsersById(seenUserIds)
	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"users": seenUsers,
	})
}
