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
	UserId    int64  `json:"user_id"`
	FeelingId int64  `json:"feeling_id"`
	Children  []Post `json:"children"`
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
	UserId    int64 `json:"user_id"`
	FeelingId int64 `json:"feeling_id"`
	ParentId  int64 `json:"parent_id"`
}

func (e *Env) HandleAddPost(c *gin.Context) {
	var addPost AddPost
	if c.ShouldBind(&addPost) != nil {
		SendError(c, http.StatusBadRequest, "Bad post request!")
	}

	addPostSql := `INSERT INTO "post"("user_id", "feeling_id", "parent_id") VALUES ($1, $2, $3) RETURNING "post_id"`
	var postId int64 = 0
	err := e.db.QueryRow(addPostSql, addPost.UserId, addPost.FeelingId, addPost.ParentId).Scan(&postId)
	if err != nil {
		fmt.Println(err)
	}
	c.JSON(200, gin.H{
		"post_id": postId,
	})
}

func main() {
	db := OpenDb()
	defer db.Close()

	r := gin.Default()
	r.GET("/api/feed", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"posts": []Post{},
		})
	})
	env := &Env{db: db}
	r.POST("/api/user", env.HandleAddUser)
	r.POST("/api/post", env.HandleAddPost)
	r.Run() // listen and serve on 0.0.0.0:8080
}
