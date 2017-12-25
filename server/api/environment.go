package api

import (
	"feelings/server/database"
)

type ApiEnv struct {
	DbEnv *database.Env
}

func GetApiEnv(dbEnv *database.Env) *ApiEnv {
	return &ApiEnv{
		DbEnv: dbEnv,
	}
}
