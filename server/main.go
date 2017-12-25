package main

import (
	"feelings/server/database"
	"fmt"
	"github.com/appleboy/gin-jwt"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

func main() {
	env := database.OpenDbEnv()
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

	api := r.Group("/api")
	api.Use(auth.MiddlewareFunc())
	{
		api.GET("/feed", env.HandleGetFeed)
		api.GET("/friends", env.HandleGetFriends)
		api.POST("/user", env.HandleAddUser)
		api.POST("/post", env.HandleAddPost)
		api.GET("/feelings", env.HandleGetFeelings)
	}

	r.Run() // listen and serve on 0.0.0.0:8080
}
