package util

import (
	"github.com/appleboy/gin-jwt"
	"github.com/gin-gonic/gin"
	"strconv"
)

func SendError(c *gin.Context, code int, error string) {
	c.JSON(code, gin.H{
		"error": error,
	})
}

func GetUserId(c *gin.Context) int64 {
	claims := jwt.ExtractClaims(c)
	userIdString, isString := claims["id"].(string)
	if isString {
		userId, err := strconv.ParseInt(userIdString, 10, 64)
		if err == nil {
			return userId
		}
	}
	return -1
}
