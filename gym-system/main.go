package main

import (
	_ "embed"
	"fmt"
	"log"
	"net/http"
	"os"

	"gym-system/database"
	"gym-system/handlers"
	"gym-system/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

//go:embed static/index.html
var indexHTML string

//go:embed static/app.js
var appJS string

//go:embed static/styles.css
var stylesCSS string

func main() {
	// Banner de inicio
	fmt.Println("🏋️  ========================================")
	fmt.Println("🏋️  SISTEMA DE GIMNASIO - FITGYM")
	fmt.Println("🏋️  Desarrollado en Go + React")
	fmt.Println("🏋️  ========================================")

	// Conectar a la base de datos
	fmt.Println("📊 Conectando a la base de datos...")
	database.Connect()

	// Configurar router
	r := gin.Default()

	// Configurar CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Servir archivos estáticos embebidos
	r.GET("/", func(c *gin.Context) {
		c.Header("Content-Type", "text/html; charset=utf-8")
		c.String(http.StatusOK, indexHTML)
	})

	r.GET("/static/app.js", func(c *gin.Context) {
		c.Header("Content-Type", "application/javascript; charset=utf-8")
		c.String(http.StatusOK, appJS)
	})

	r.GET("/static/styles.css", func(c *gin.Context) {
		c.Header("Content-Type", "text/css; charset=utf-8")
		c.String(http.StatusOK, stylesCSS)
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Rutas de la API - Públicas
	api := r.Group("/api")
	{
		api.POST("/register", handlers.Registrar)
		api.POST("/login", handlers.IniciarSesion)
		api.GET("/activities", handlers.ObtenerActividades)
		api.GET("/activities/:id", handlers.ObtenerActividadPorID)
		api.GET("/activities/search", handlers.BuscarActividades)
		api.GET("/categories", handlers.ObtenerCategorias)
	}

	// Rutas protegidas
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/activities/:id/enroll", handlers.InscribirseActividad)
		protected.GET("/profile", handlers.ObtenerPerfil)
		protected.GET("/enrollments", handlers.ObtenerInscripcionesUsuario)
	}

	// Puerto del servidor
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Servidor iniciando en puerto %s\n", port)
	fmt.Printf("📱 Frontend: http://localhost:%s\n", port)
	fmt.Printf("🔗 API: http://localhost:%s/api\n", port)
	fmt.Println("💡 Listo para recibir conexiones...")

	// Iniciar servidor
	log.Fatal(r.Run(":" + port))
}
