package models

import (
	"time"
)

type Inscripcion struct {
	ID               uint       `json:"id" gorm:"primaryKey;column:id"`
	UsuarioID        uint       `json:"usuario_id" gorm:"column:usuario_id;not null"`
	ActividadID      uint       `json:"actividad_id" gorm:"column:actividad_id;not null"`
	FechaInscripcion time.Time  `json:"fecha_inscripcion" gorm:"column:fecha_inscripcion;default:CURRENT_TIMESTAMP"`
	Estado           string     `json:"estado" gorm:"column:estado;default:activa"`
	FechaInicio      *time.Time `json:"fecha_inicio,omitempty" gorm:"column:fecha_inicio"`
	FechaFin         *time.Time `json:"fecha_fin,omitempty" gorm:"column:fecha_fin"`
	Notas            string     `json:"notas,omitempty" gorm:"column:notas"`
	CreatedAt        time.Time  `json:"created_at" gorm:"column:created_at"`
	UpdatedAt        time.Time  `json:"updated_at" gorm:"column:updated_at"`

	Usuario   Usuario   `json:"usuario,omitempty" gorm:"foreignKey:UsuarioID"`
	Actividad Actividad `json:"actividad,omitempty" gorm:"foreignKey:ActividadID"`
}

func (Inscripcion) TableName() string {
	return "inscripcion"
}
