package database

import (
	_ "database/sql"
	"feelings/server/types"
)

func (e *Env) GetUserByEmail(userEmail string) (*types.User, error) {
	var user types.User
	err := e.db.QueryRow(
		`SELECT user_id, name, email FROM "user" WHERE "email" = $1`,
		userEmail,
	).Scan(&user.Id, &user.Name, &user.Email)
	if err != nil {
		return &types.User{}, err
	}

	return &user, nil
}

func (e *Env) CheckAuthentication(userEmail string) (int64, bool) {
	user, err := e.GetUserByEmail(userEmail)
	if err != nil {
		return -1, false
	}
	return user.Id, true
}
