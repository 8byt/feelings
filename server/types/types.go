package types

import (
	"database/sql"
)

type MiniUser struct {
	UserId int64  `json:"id"`
	Name   string `json:"name"`
}

type NewUser struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type User struct {
	Id         int64       `json:"id"`
	Email      string      `json:"email"`
	Name       string      `json:"name"`
	TimeJoined int64       `json:"timeJoined"`
	Friends    []*MiniUser `json:"friends"`
}

type Feeling struct {
	Id    int64  `json:"id"`
	Name  string `json:"name"`
	Glyph string `json:"glyph"`
}

type DbPost struct {
	PostId    int64
	UserId    int64
	FeelingId int
	ParentId  sql.NullInt64
	TimeAdded float64
	Count     sql.NullInt64
}

type Post struct {
	Id        int64   `json:"id"`
	UserId    int64   `json:"userId"`
	FeelingId int     `json:"feelingId"`
	Children  []*Post `json:"children"`
	TimeAdded float64 `json:"timeAdded"`
	Count	  int64   `json:"count"`
}
