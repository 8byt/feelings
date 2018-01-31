package api

import (
	"feelings/server/util"
	"github.com/gin-gonic/gin"
	"net/http"
)

func (e *ApiEnv) HandleGetFeelings(c *gin.Context) {
	feelings, err := e.DbEnv.GetFeelings()
	if err != nil {
		util.SendError(c, http.StatusInternalServerError, err.Error())
	}

	c.JSON(http.StatusOK, gin.H{
		"feelings": feelings,
	})
}
