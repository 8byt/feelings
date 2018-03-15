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
	addPostSql := `INSERT INTO "post"("user_id", "feeling_id", "parent_id", "count") VALUES ($1, $2, $3, $4) RETURNING "post_id"`
	var postId int64 = 0
	var maybeParentId sql.NullInt64
	var maybeCount sql.NullInt64

	// handle case where parent id isn't given
	if req.ParentId > 0 {
		maybeParentId.Valid = true
		maybeParentId.Int64 = req.ParentId
	} else {
		maybeCount.Valid = true
		maybeCount.Int64 = 1
	}
	err := e.Db.QueryRow(addPostSql, req.UserId, req.FeelingId, maybeParentId, maybeCount).Scan(&postId)

	return postId, err
}

func (e *Env) GetLatestPost(userId int64) (*types.DbPost, error) {
	var latestPost types.DbPost
	getPostSql := `
		SELECT post_id, feeling_id, EXTRACT(epoch FROM time_added) * 1000 AS time_added FROM "post"
			WHERE parent_id IS NULL AND user_id = $1
			ORDER BY time_added DESC LIMIT 1`
	err := e.Db.QueryRow(getPostSql, userId).Scan(&latestPost.PostId, &latestPost.FeelingId, &latestPost.TimeAdded)

	if err != nil {
		return &types.DbPost{}, err
	}
	return &latestPost, err
}

func (e *Env) IncrementPostCount(postId int64) (int64, error) {
	incPostSql := `UPDATE "post" SET "count" = COALESCE("count", 0) + 1 WHERE post_id = $1 RETURNING post_id`

	err := e.Db.QueryRow(incPostSql, postId).Scan(&postId)

	return postId, err
}

func (e *Env) GetPosts(rootParentId sql.NullInt64) ([]*types.Post, error) {
	recursivePostSql := `
		WITH RECURSIVE nodes(post_id, user_id, feeling_id, parent_id, time_added, count) AS (
			SELECT p1.post_id, p1.user_id, p1.feeling_id, p1.parent_id, EXTRACT(epoch FROM p1.time_added) * 1000, p1.count
			FROM post p1 WHERE parent_id IS NOT DISTINCT FROM $1
			UNION
			SELECT p2.post_id, p2.user_id, p2.feeling_id, p2.parent_id, EXTRACT(epoch FROM p2.time_added) * 1000, p2.count
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
		err = rows.Scan(&dbPost.PostId, &dbPost.UserId, &dbPost.FeelingId, &dbPost.ParentId, &dbPost.TimeAdded, &dbPost.Count)
		if err != nil {
			return []*types.Post{}, err
		}

		AddPost(dbPost.ParentId, &types.Post{
			Id:        dbPost.PostId,
			UserId:    dbPost.UserId,
			FeelingId: dbPost.FeelingId,
			Children:  []*types.Post{},
			TimeAdded: dbPost.TimeAdded,
			Count:	   dbPost.Count.Int64,
		})
	}

	return posts, nil
}
