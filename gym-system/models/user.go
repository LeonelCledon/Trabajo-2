package models

import (
	"time"
)

type Usuario struct {
	ID              uint       `json:"id" gorm:"primaryKey;column:id"`
	Nombre          string     `json:"nombre" gorm:"column:nombre;not null"`
	Email           string     `json:"email" gorm:"column:email;unique;not null"`
	Password        string     `json:"-" gorm:"column:password;not null"`
	Telefono        string     `json:"telefono,omitempty" gorm:"column:telefono"`
	FechaNacimiento *time.Time `json:"fecha_nacimiento,omitempty" gorm:"column:fecha_nacimiento"`
	Rol             string     `json:"rol" gorm:"column:rol;default:miembro"`
	Activo          bool       `json:"activo" gorm:"column:activo;default:true"`
	CreatedAt       time.Time  `json:"created_at" gorm:"column:created_at"`
	UpdatedAt       time.Time  `json:"updated_at" gorm:"column:updated_at"`
}

func (Usuario) TableName() string {
	return "usuario"
}

type AuthRequest struct {
	Nombre   string `json:"nombre,omitempty"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Telefono string `json:"telefono,omitempty"`
}

type AuthResponse struct {
	Token   string  `json:"token"`
	Usuario Usuario `json:"usuario"`
}
