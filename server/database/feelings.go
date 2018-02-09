package database

import (
	"feelings/server/types"

	_ "database/sql"
)

func (e *Env) GetFeelings() ([]*types.Feeling, error) {
	rows, err := e.Db.Query(
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
