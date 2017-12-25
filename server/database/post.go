package database

import (
	"database/sql"
	"feelings/server/types"
	"feelings/server/util"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AddPost struct {
	UserId    int64 `json:"user_id" binding:"required"`
	FeelingId int   `json:"feeling_id" binding:"required"`
	ParentId  int64 `json:"parent_id"`
}

func (e *Env) HandleAddPost(c *gin.Context) {
	var addPost AddPost
	if err := c.ShouldBind(&addPost); err != nil {
		util.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	addPostSql := `INSERT INTO "post"("user_id", "feeling_id", "parent_id") VALUES ($1, $2, $3) RETURNING "post_id"`
	var postId int64 = 0
	var maybeParentId sql.NullInt64

	// handle case where parent id isn't given
	if addPost.ParentId > 0 {
		maybeParentId.Valid = true
		maybeParentId.Int64 = addPost.ParentId
	}
	err := e.db.QueryRow(addPostSql, addPost.UserId, addPost.FeelingId, maybeParentId).Scan(&postId)
	if err != nil {
		util.SendError(c, 500, err.Error())
		return
	}
	c.JSON(200, gin.H{
		"post_id": postId,
	})
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
	rows, err := e.db.Query(
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
