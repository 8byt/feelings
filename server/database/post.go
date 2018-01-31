package database

import (
	"database/sql"
	"feelings/server/types"
)

type ReqAddPost struct {
	UserId    int64 `json:"userId" binding:"required"`
	FeelingId int   `json:"feelingId" binding:"required"`
	ParentId  int64 `json:"parentId"`
}

func (e *Env) AddPost(req ReqAddPost) (int64, error) {
	addPostSql := `INSERT INTO "post"("user_id", "feeling_id", "parent_id") VALUES ($1, $2, $3) RETURNING "post_id"`
	var postId int64 = 0
	var maybeParentId sql.NullInt64

	// handle case where parent id isn't given
	if req.ParentId > 0 {
		maybeParentId.Valid = true
		maybeParentId.Int64 = req.ParentId
	}
	err := e.Db.QueryRow(addPostSql, req.UserId, req.FeelingId, maybeParentId).Scan(&postId)

	return postId, err
}

func (e *Env) GetPosts(rootParentId sql.NullInt64) ([]*types.Post, error) {
	recursivePostSql := `
		WITH RECURSIVE nodes(post_id, user_id, feeling_id, parent_id) AS (
			SELECT p1.post_id, p1.user_id, p1.feeling_id, p1.parent_id
			FROM post p1 WHERE parent_id IS NOT DISTINCT FROM $1
			UNION
			SELECT p2.post_id, p2.user_id, p2.feeling_id, p2.parent_id
			FROM post p2, nodes s1 WHERE p2.parent_id = s1.post_id
		)
		SELECT * FROM nodes;`
	rows, err := e.Db.Query(
		recursivePostSql,
		rootParentId,
	)
	if err != nil {
		return []*types.Post{}, err
	}
	defer rows.Close()

	var posts []*types.Post

	var idMap = make(map[int64]*types.Post)

	AddPost := func(postParentId sql.NullInt64, post *types.Post) {
		idMap[post.Id] = post
		if !postParentId.Valid {
			posts = append(posts, post)
			return
		}
		parentPost := idMap[postParentId.Int64]
		parentPost.Children = append(parentPost.Children, post)
	}

	for rows.Next() {
		var dbPost types.DbPost
		err = rows.Scan(&dbPost.PostId, &dbPost.UserId, &dbPost.FeelingId, &dbPost.ParentId)
		if err != nil {
			return []*types.Post{}, err
		}

		AddPost(dbPost.ParentId, &types.Post{
			Id:        dbPost.PostId,
			UserId:    dbPost.UserId,
			FeelingId: dbPost.FeelingId,
			Children:  []*types.Post{},
		})
	}

	return posts, nil
}
