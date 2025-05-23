package handlers

import (
	"crypto/sha256"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"gym-system/database"
	"gym-system/models"
)

func hashPassword(password string) string {
	h := sha256.New()
	h.Write([]byte(password))
	return fmt.Sprintf("%x", h.Sum(nil))
}

func generateToken(usuarioID uint, email string, rol string) (string, error) {
	claims := jwt.MapClaims{
		"usuario_id": usuarioID,
		"email":      email,
		"rol":        rol,
		"exp":        time.Now().Add(time.Hour * 24 * 7).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "gym-secret-key-2024"
	}

	return token.SignedString([]byte(jwtSecret))
}

func Registrar(c *gin.Context) {
	var req models.AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var usuarioExistente models.Usuario
	if err := database.GetDB().Where("email = ?", req.Email).First(&usuarioExistente).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El usuario ya existe"})
		return
	}

	usuario := models.Usuario{
		Nombre:   req.Nombre,
		Email:    req.Email,
		Password: hashPassword(req.Password),
		Telefono: req.Telefono,
		Rol:      "miembro",
		Activo:   true,
	}

	if err := database.GetDB().Create(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear usuario"})
		return
	}

	token, err := generateToken(usuario.ID, usuario.Email, usuario.Rol)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar token"})
		return
	}

	c.JSON(http.StatusCreated, models.AuthResponse{
		Token:   token,
		Usuario: usuario,
	})
}

func IniciarSesion(c *gin.Context) {
	var req models.AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var usuario models.Usuario
	if err := database.GetDB().Where("email = ? AND activo = ?", req.Email, true).First(&usuario).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	if usuario.Password != hashPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	token, err := generateToken(usuario.ID, usuario.Email, usuario.Rol)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar token"})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Token:   token,
		Usuario: usuario,
	})
}

func ObtenerPerfil(c *gin.Context) {
	usuarioID, _ := c.Get("usuario_id")

	var usuario models.Usuario
	if err := database.GetDB().Where("id = ? AND activo = ?", usuarioID, true).First(&usuario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, usuario)
}
