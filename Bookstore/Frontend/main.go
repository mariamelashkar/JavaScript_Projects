// Note : we can handle errors in one function instead of repeating
package main

import (
	"errors"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type books struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Author   string `json:"author"`
	Quantity int    `json:"quantity"`
}

var book = []books{
	{ID: "2", Name: "Mariam", Author: "Mariam", Quantity: 2},
	{ID: "3", Name: "Maryomaa", Author: "Maryomaa", Quantity: 3},
}

/*
	func getHeader(c *gin.Context) {
	    value := c.Request.Header.Get("Authorization")
	    c.String(http.StatusOK, "The value of Authorization header is %s", value)
	}

	func setHeader(c *gin.Context) {
	    c.Header("X-Custom-Header", "hello world")
	    c.String(http.StatusOK, "Header set successfully")
	}

	func JSON(c *gin.Context, code int, obj interface{}) {
	    c.Header("Content-Type", "Mariam")
	    c.JSON(code, obj)
	}
*/
func getbook(c *gin.Context) {
	c.Header("ngrok-skip-browser-warning", "69420")
	//c.Header("user-agent","Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36")
	c.IndentedJSON(http.StatusOK, book)
	//c take the data from incoming http request
	//to convert the incoming data into json
	//Note : every GET Request should have something like this handler function
}

func createbook(c *gin.Context) {
	c.Header("ngrok-skip-browser-warning", "69420")
	var newbook books
	if err := c.BindJSON(&newbook); /*take whatever json inside the request body and bind it to this newbook var */ err != nil {
		return //bad request status code as c.BindJSON gives that
	}

	book = append(book, newbook)
	c.IndentedJSON(http.StatusCreated, newbook) //convert newbook into json

}
func searchforabook(id string) (*books, error) { //err exists because if we don't find the book we gonna return it

	for index, value := range book {
		if value.Name == id {
			return &book[index], nil //we return a pointer because if we want modify it from a different function
		}
	}
	return nil, errors.New("book not found")
}
func getbookbyname(c *gin.Context) {
	c.Header("ngrok-skip-browser-warning", "69420")
	name := c.Param("Name") //put the param into a variable to pass whatever come from the path to the fuction search for a book (extract id from paramter)
	book, err := searchforabook(name)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "The book is Not found"}) //shortcut allow us to write our custom JSON)
		return
	}
	c.IndentedJSON(http.StatusOK, book)
}
func checkoutbookbyid(c *gin.Context) {
	c.Header("ngrok-skip-browser-warning", "69420")
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
	c.Header("ngrok-skip-browser-warning", "69420")
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
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true                          // Allow all origins. Adjust this in production.
	config.AllowMethods = []string{"GET", "POST", "PATCH"} // Specify allowed HTTP methods
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "ngrok-skip-browser-warning"}
	router.Use(cors.New(config))    //create our server
	router.GET("/getbook", getbook) //path which be appended to the url , the fuction which gonna return the json data
	router.GET("/getbook/:Name", getbookbyname)
	router.PATCH("/getbookcheckout/:Name", checkoutbookbyid)
	router.PATCH("/getbookcheckin/:Name", addbookbyid)
	router.POST("/createbook", createbook)
	router.Run("localhost:8080")
}
