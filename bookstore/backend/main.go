package main

import (
	"errors"
	"net/http"
	"github.com/gin-gonic/gin"
	"log"
	"github.com/gin-contrib/cors"

)

type books struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Author   string `json:"author"`
	Quantity int    `json:"quantity"`
}

var book []books

func getbook(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, book)
}

func createbook(c *gin.Context) {
	var newbook books
	if err := c.BindJSON(&newbook); err != nil {
		return //bad request status code as c.BindJSON gives that
	}

	book = append(book, newbook)
	c.IndentedJSON(http.StatusCreated, newbook) //convert newbook into json

}
func searchforabook(id string) (*books, error) {

	for index, value := range book {
		if value.Name == id {
			return &book[index], nil //we return a pointer because if we want modify it from a different function
		}
	}
	return nil, errors.New("book not found")
}
func getbookbyname(c *gin.Context) {
	name := c.Param("Name") 
	book, err := searchforabook(name)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "The book is Not found"})
		return
	}
	c.IndentedJSON(http.StatusOK, book)
}
func checkoutbookbyid(c *gin.Context) {
	name := c.Param("Name")
	book, err := searchforabook(name)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "The book is Not found"})
		return
	}
	book.Quantity -= 1
	c.IndentedJSON(http.StatusOK, book)
}
func addbookbyid(c *gin.Context) {
	name := c.Param("Name")
	book, err := searchforabook(name)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "The book is Not found"})
		return
	}
	book.Quantity += 1
	c.IndentedJSON(http.StatusOK, book)
}

func main() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Allow all origins for testing purposes. Replace with specific URL for production.
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Access-Control-Allow-Origin", "Content-Type","ngrok-skip-browser-warning"},
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin"},
		AllowCredentials: true,
	}))
	router.GET("/getbook", getbook) 
	router.GET("/getbook/:Name", getbookbyname)
	router.PATCH("/getbookcheckout/:Name", checkoutbookbyid)
	router.PATCH("/getbookcheckin/:Name", addbookbyid)
	router.POST("/createbook", createbook)

	router.Run("localhost:8000")
	log.Println("Server started at :8000")
	
}

