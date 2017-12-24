package main

import "github.com/gin-gonic/gin"
import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"net/http"
	"strings"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "dev"
	password = "hunter2"
	dbname   = "feelings"
)

type Env struct {
	db *sql.DB
}

type User struct {
	Id      int64  `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Friends []User `json:"friends"`
}

type Feeling struct {
	Id    int64  `json:"id"`
	Name  string `json:"name"`
	Glyph string `json:"glyph"`
}

type Post struct {
	Id        int64  `json:"id"`
	UserId    int64  `json:"userId"`
	FeelingId int  `json:"feelingId"`
	Children  []*Post `json:"children"`
}

func SendError(c *gin.Context, code int, error string) {
	c.JSON(code, gin.H{
		"error": error,
	})
}

func OpenDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")
	return db
}

func (e *Env) HandleAddUser(c *gin.Context) {
	name := c.Query("name")
	email := c.Query("email")

	if len(name) < 2 {
		SendError(c, http.StatusBadRequest, "name not long enough")
		return
	}
	if len(email) == 0 {
		SendError(c, http.StatusBadRequest, "no email specified")
		return
	} else if len(strings.Split(email, "@")) != 2 {
		SendError(c, http.StatusBadRequest, "email invalid")
		return
	}
	var userId int64 = 0
	err := e.db.QueryRow(
		`INSERT INTO "user"("name", "email") VALUES ($1, $2) RETURNING "user_id"`,
		name,
		email,
	).Scan(&userId)
	if err != nil {
		fmt.Println(err)
		SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(200, gin.H{
		"user_id": userId,
	})
}

type AddPost struct {
	UserId    int64 `json:"user_id" binding:"required"`
	FeelingId int `json:"feeling_id" binding:"required"`
	ParentId  int64 `json:"parent_id"`
}

func (e *Env) HandleAddPost(c *gin.Context) {
	var addPost AddPost
	if err := c.ShouldBind(&addPost); err != nil {
		SendError(c, http.StatusBadRequest, err.Error())
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
		SendError(c, 500, err.Error())
		return
	}
	c.JSON(200, gin.H{
		"post_id": postId,
	})
}


type DbPost struct {
	PostId int64
	UserId int64
	FeelingId int
	ParentId int64
}

//TODO(sam): there has got to be a better way of doing this
func (e *Env) GetPosts(rootParentId sql.NullInt64) ([]*Post, error) {
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
		return []*Post{}, err
	}
	defer rows.Close()

	var posts []*Post

	var idMap = make(map[int64]*Post)

	AddPost := func (postParentId sql.NullInt64, post *Post) {
		idMap[post.Id] = post
		if !postParentId.Valid {
			posts = append(posts, post)
			return
		}
		parentPost := idMap[postParentId.Int64]
		parentPost.Children = append(parentPost.Children, post)
	}

	for rows.Next() {
		var postId int64
		var userId int64
		var feelingId int
		var maybeParentId sql.NullInt64
		err = rows.Scan(&postId, &userId, &feelingId, &maybeParentId)
		if err != nil {
			return []*Post{}, err
		}

		AddPost(maybeParentId, &Post{
			Id:        postId,
			UserId:    userId,
			FeelingId: feelingId,
			Children:  []*Post{},
		})
	}

	return posts, nil
}

func (e *Env) HandleGetFeed(c *gin.Context) {
	posts, err := e.GetPosts(sql.NullInt64{})
	if err != nil {
		SendError(c, 500, err.Error())
		return
	}
	c.JSON(200, gin.H{
		"posts": posts,
	})
}

func main() {
	db := OpenDb()
	defer db.Close()

	r := gin.Default()
	env := &Env{db: db}

	r.GET("/api/feed", env.HandleGetFeed)
	r.POST("/api/user", env.HandleAddUser)
	r.POST("/api/post", env.HandleAddPost)
	r.Run() // listen and serve on 0.0.0.0:8080
}
