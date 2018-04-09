package main

import (
	"feelings/server/api"
	"feelings/server/database"
	"fmt"
	"github.com/appleboy/gin-jwt"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

func main() {
	env := database.OpenDbEnv()
	apiEnv := api.GetApiEnv(env)
	defer env.Close()

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	auth := &jwt.GinJWTMiddleware{
		Realm:      "test",
		Key:        []byte("super secret dev key"),
		Timeout:    time.Hour,
		MaxRefresh: time.Hour,
		Authenticator: func(userEmail string, password string, c *gin.Context) (string, bool) {
			fmt.Println(userEmail)
			// TODO(danny): actually check something besides email
			userId, authenticated := env.CheckAuthentication(userEmail)
			return strconv.FormatInt(userId, 10), authenticated
		},
	}

	r.POST("/login", auth.LoginHandler)
	r.POST("/user", apiEnv.HandleAddUser)

	apiGroup := r.Group("/api")
	apiGroup.Use(auth.MiddlewareFunc())
	{
		apiGroup.GET("/current-user", apiEnv.HandleGetCurrentUser)

		apiGroup.GET("/feed", apiEnv.HandleGetFeed)

		apiGroup.GET("/friends", apiEnv.HandleGetFriends)
		apiGroup.GET("/friends/pending", apiEnv.HandleGetPendingFriends)
		apiGroup.POST("/friends/add", apiEnv.HandleAddFriend)
		apiGroup.POST("/friends/confirm", apiEnv.HandleConfirmFriend)

		apiGroup.POST("/post", apiEnv.HandleAddPost)

		apiGroup.GET("/feelings", apiEnv.HandleGetFeelings)

		apiGroup.POST("/feedback", apiEnv.HandleAddFeedback)
	}

	r.Run() // listen and serve on 0.0.0.0:8080
}
