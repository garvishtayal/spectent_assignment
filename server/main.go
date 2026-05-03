package main

import (
	"net/http"
	"regexp"
	"strings"
	"sync"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
)

const (
	maxNameLen     = 120
	maxFeedbackLen = 4000
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

type FeedbackInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Feedback string `json:"feedback"`
}

type Feedback struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Feedback string `json:"feedback"`
}

type store struct {
	mu   sync.Mutex
	list []Feedback
}

var memory store

func validate(in FeedbackInput) string {
	name := strings.TrimSpace(in.Name)
	email := strings.TrimSpace(strings.ToLower(in.Email))
	fb := strings.TrimSpace(in.Feedback)

	if name == "" {
		return "name is required"
	}
	if utf8.RuneCountInString(name) > maxNameLen {
		return "name is too long"
	}
	if email == "" {
		return "email is required"
	}
	if !emailRegex.MatchString(email) {
		return "invalid email format"
	}
	if fb == "" {
		return "feedback is required"
	}
	if utf8.RuneCountInString(fb) > maxFeedbackLen {
		return "feedback is too long"
	}
	return ""
}

func postFeedback(c *gin.Context) {
	var in FeedbackInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"ok": false, "error": "invalid JSON body"})
		return
	}

	if msg := validate(in); msg != "" {
		c.JSON(http.StatusBadRequest, gin.H{"ok": false, "error": msg})
		return
	}

	f := Feedback{
		Name:     strings.TrimSpace(in.Name),
		Email:    strings.TrimSpace(strings.ToLower(in.Email)),
		Feedback: strings.TrimSpace(in.Feedback),
	}

	memory.mu.Lock()
	memory.list = append(memory.list, f)
	memory.mu.Unlock()

	c.JSON(http.StatusCreated, gin.H{"ok": true, "message": "feedback received"})
}

func main() {
	r := gin.Default()
	r.MaxMultipartMemory = 1 << 20 // 1 MiB

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	r.POST("/feedback", postFeedback)

	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}
