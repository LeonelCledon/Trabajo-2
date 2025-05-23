package models

import (
	"time"
)

type Categoria struct {
	ID          uint      `json:"id" gorm:"primaryKey;column:id"`
	Nombre      string    `json:"nombre" gorm:"column:nombre;not null;unique"`
	Descripcion string    `json:"descripcion,omitempty" gorm:"column:descripcion"`
	Activa      bool      `json:"activa" gorm:"column:activa;default:true"`
	CreatedAt   time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"column:updated_at"`
}

func (Categoria) TableName() string {
	return "categoria"
}

type Actividad struct {
	ID           uint      `json:"id" gorm:"primaryKey;column:id"`
	Nombre       string    `json:"nombre" gorm:"column:nombre;not null"`
	Descripcion  string    `json:"descripcion,omitempty" gorm:"column:descripcion"`
	CapMaxima    int       `json:"cap_maxima" gorm:"column:cap_maxima;not null;default:20"`
	Duracion     string    `json:"duracion" gorm:"column:duracion;not null"`
	Horario      string    `json:"horario" gorm:"column:horario;not null"`
	Instructor   string    `json:"instructor" gorm:"column:instructor;not null"`
	Precio       float64   `json:"precio" gorm:"column:precio;default:0.00"`
	Nivel        string    `json:"nivel" gorm:"column:nivel;default:principiante"`
	Equipamiento string    `json:"equipamiento,omitempty" gorm:"column:equipamiento"`
	Imagen       string    `json:"imagen,omitempty" gorm:"column:imagen"`
	CategoriaID  uint      `json:"categoria_id" gorm:"column:categoria_id;not null"`
	Activa       bool      `json:"activa" gorm:"column:activa;default:true"`
	CreatedAt    time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"column:updated_at"`

	Categoria Categoria `json:"categoria,omitempty" gorm:"foreignKey:CategoriaID"`
}

func (Actividad) TableName() string {
	return "actividad"
}

type ActividadCompleta struct {
	Actividad
	CategoriaNombre      string `json:"categoria_nombre"`
	CategoriaDescripcion string `json:"categoria_descripcion"`
	InscritosActuales    int    `json:"inscritos_actuales"`
	CuposDisponibles     int    `json:"cupos_disponibles"`
	EstadoCupos          string `json:"estado_cupos"`
}
