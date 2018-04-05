package database

type ReqAddFeedback struct {
	UserId  int64  `json:"userId" binding:"required"`
	Content string `json:"content" binding:"required"`
}

func (e *Env) AddFeedback(req ReqAddFeedback) (int64, error) {
	addFeedbackSql := `INSERT INTO feedback(user_id, "content") VALUES ($1, $2) RETURNING "feedback_id"`
	var feedbackId int64 = 0
	err := e.Db.QueryRow(addFeedbackSql, req.UserId, req.Content).Scan(&feedbackId)

	return feedbackId, err
}
