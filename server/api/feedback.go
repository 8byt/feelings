package api

import (
	"github.com/gin-gonic/gin"
	"feelings/server/util"
	"net/http"
	"feelings/server/database"
)

func (e *ApiEnv) HandleAddFeedback(c *gin.Context) {
	var addFeedbackReq database.ReqAddFeedback
	if err := c.ShouldBind(&addFeedbackReq); err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	feedbackId, err := e.DbEnv.AddFeedback(addFeedbackReq)

	if err != nil {
		util.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"feedbackId": feedbackId,
	})
}
