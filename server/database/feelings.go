package database

import (
	"feelings/server/types"
	"feelings/server/util"
	"github.com/gin-gonic/gin"

	_ "database/sql"
)

func (e *Env) GetFeelings() ([]*types.Feeling, error) {
	rows, err := e.db.Query(
		`SELECT feeling_id, "name", glyph FROM "feeling"`,
	)
	if err != nil {
		return []*types.Feeling{}, err
	}
	defer rows.Close()

	var feelings []*types.Feeling

	for rows.Next() {
		var feeling types.Feeling
		err = rows.Scan(&feeling.Id, &feeling.Name, &feeling.Glyph)
		if err != nil {
			return []*types.Feeling{}, err
		}
		feelings = append(feelings, &feeling)
	}

	return feelings, nil
}

func (e *Env) HandleGetFeelings(c *gin.Context) {
	feelings, err := e.GetFeelings()
	if err != nil {
		util.SendError(c, 500, err.Error())
	}

	c.JSON(200, gin.H{
		"feelings": feelings,
	})
}
