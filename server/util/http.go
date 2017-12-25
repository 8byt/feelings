package util

import "github.com/gin-gonic/gin"

func SendError(c *gin.Context, code int, error string) {
	c.JSON(code, gin.H{
		"error": error,
	})
}
