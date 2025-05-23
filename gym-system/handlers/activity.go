package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gym-system/database"
	"gym-system/models"
)

func ObtenerActividades(c *gin.Context) {
	var actividades []models.ActividadCompleta

	query := `
		SELECT 
			a.id, a.nombre, a.descripcion, a.cap_maxima, a.duracion, a.horario,
			a.instructor, a.precio, a.nivel, a.equipamiento, a.imagen, a.categoria_id,
			a.activa, a.created_at, a.updated_at,
			c.nombre as categoria_nombre,
			c.descripcion as categoria_descripcion,
			COUNT(i.id) as inscritos_actuales,
			(a.cap_maxima - COUNT(i.id)) as cupos_disponibles,
			CASE 
				WHEN COUNT(i.id) >= a.cap_maxima THEN 'Completa'
				WHEN COUNT(i.id) >= a.cap_maxima * 0.8 THEN 'Casi Completa'
				ELSE 'Disponible'
			END as estado_cupos
		FROM actividad a
		LEFT JOIN categoria c ON a.categoria_id = c.id
		LEFT JOIN inscripcion i ON a.id = i.actividad_id AND i.estado = 'activa'
		WHERE a.activa = TRUE AND c.activa = TRUE
		GROUP BY a.id, a.nombre, a.descripcion, a.cap_maxima, a.duracion, a.horario,
				 a.instructor, a.precio, a.nivel, a.equipamiento, a.imagen, a.categoria_id,
				 a.activa, a.created_at, a.updated_at, c.nombre, c.descripcion
		ORDER BY a.created_at DESC
	`

	if err := database.GetDB().Raw(query).Scan(&actividades).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener actividades"})
		return
	}

	c.JSON(http.StatusOK, actividades)
}

func ObtenerActividadPorID(c *gin.Context) {
	id := c.Param("id")
	var actividad models.ActividadCompleta

	query := `
		SELECT 
			a.id, a.nombre, a.descripcion, a.cap_maxima, a.duracion, a.horario,
			a.instructor, a.precio, a.nivel, a.equipamiento, a.imagen, a.categoria_id,
			a.activa, a.created_at, a.updated_at,
			c.nombre as categoria_nombre,
			c.descripcion as categoria_descripcion,
			COUNT(i.id) as inscritos_actuales,
			(a.cap_maxima - COUNT(i.id)) as cupos_disponibles,
			CASE 
				WHEN COUNT(i.id) >= a.cap_maxima THEN 'Completa'
				WHEN COUNT(i.id) >= a.cap_maxima * 0.8 THEN 'Casi Completa'
				ELSE 'Disponible'
			END as estado_cupos
		FROM actividad a
		LEFT JOIN categoria c ON a.categoria_id = c.id
		LEFT JOIN inscripcion i ON a.id = i.actividad_id AND i.estado = 'activa'
		WHERE a.id = ? AND a.activa = TRUE AND c.activa = TRUE
		GROUP BY a.id, a.nombre, a.descripcion, a.cap_maxima, a.duracion, a.horario,
				 a.instructor, a.precio, a.nivel, a.equipamiento, a.imagen, a.categoria_id,
				 a.activa, a.created_at, a.updated_at, c.nombre, c.descripcion
	`

	if err := database.GetDB().Raw(query, id).Scan(&actividad).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}

	if actividad.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}

	c.JSON(http.StatusOK, actividad)
}

func BuscarActividades(c *gin.Context) {
	keyword := c.Query("keyword")
	categoria := c.Query("categoria")

	var actividades []models.ActividadCompleta

	query := `
		SELECT 
			a.id, a.nombre, a.descripcion, a.cap_maxima, a.duracion, a.horario,
			a.instructor, a.precio, a.nivel, a.equipamiento, a.imagen, a.categoria_id,
			a.activa, a.created_at, a.updated_at,
			c.nombre as categoria_nombre,
			c.descripcion as categoria_descripcion,
			COUNT(i.id) as inscritos_actuales,
			(a.cap_maxima - COUNT(i.id)) as cupos_disponibles,
			CASE 
				WHEN COUNT(i.id) >= a.cap_maxima THEN 'Completa'
				WHEN COUNT(i.id) >= a.cap_maxima * 0.8 THEN 'Casi Completa'
				ELSE 'Disponible'
			END as estado_cupos
		FROM actividad a
		LEFT JOIN categoria c ON a.categoria_id = c.id
		LEFT JOIN inscripcion i ON a.id = i.actividad_id AND i.estado = 'activa'
		WHERE a.activa = TRUE AND c.activa = TRUE
	`

	args := []interface{}{}

	if keyword != "" {
		query += " AND (a.nombre LIKE ? OR a.instructor LIKE ? OR a.horario LIKE ? OR c.nombre LIKE ?)"
		searchTerm := "%" + keyword + "%"
		args = append(args, searchTerm, searchTerm, searchTerm, searchTerm)
	}

	if categoria != "" && categoria != "all" {
		query += " AND c.nombre = ?"
		args = append(args, categoria)
	}

	query += ` GROUP BY a.id, a.nombre, a.descripcion, a.cap_maxima, a.duracion, a.horario,
			   a.instructor, a.precio, a.nivel, a.equipamiento, a.imagen, a.categoria_id,
			   a.activa, a.created_at, a.updated_at, c.nombre, c.descripcion
			   ORDER BY a.created_at DESC`

	if err := database.GetDB().Raw(query, args...).Scan(&actividades).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error en la búsqueda"})
		return
	}

	c.JSON(http.StatusOK, actividades)
}

func InscribirseActividad(c *gin.Context) {
	actividadID := c.Param("id")
	usuarioID, _ := c.Get("usuario_id")

	var actividad models.Actividad
	if err := database.GetDB().Where("id = ? AND activa = ?", actividadID, true).First(&actividad).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}

	var inscripcionExistente models.Inscripcion
	if err := database.GetDB().Where("usuario_id = ? AND actividad_id = ? AND estado IN (?)",
		usuarioID, actividadID, []string{"activa", "en_espera"}).First(&inscripcionExistente).Error; err == nil {
		if inscripcionExistente.Estado == "activa" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ya estás inscrito en esta actividad"})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ya estás en la lista de espera"})
		}
		return
	}

	var inscritosCount int64
	database.GetDB().Model(&models.Inscripcion{}).Where("actividad_id = ? AND estado = ?", actividadID, "activa").Count(&inscritosCount)

	actividadIDInt, _ := strconv.Atoi(actividadID)
	fechaActual := time.Now()

	inscripcion := models.Inscripcion{
		UsuarioID:        usuarioID.(uint),
		ActividadID:      uint(actividadIDInt),
		FechaInscripcion: fechaActual,
		FechaInicio:      &fechaActual,
	}

	if int(inscritosCount) >= actividad.CapMaxima {
		inscripcion.Estado = "en_espera"
		inscripcion.Notas = "Lista de espera - actividad completa"

		if err := database.GetDB().Create(&inscripcion).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al agregar a lista de espera"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Actividad completa. Te hemos agregado a la lista de espera.",
			"estado":  "en_espera",
		})
	} else {
		inscripcion.Estado = "activa"

		if err := database.GetDB().Create(&inscripcion).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al inscribirse"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "¡Inscripción exitosa! Te esperamos en la clase.",
			"estado":  "activa",
		})
	}
}

func ObtenerCategorias(c *gin.Context) {
	var categorias []models.Categoria
	if err := database.GetDB().Where("activa = ?", true).Order("nombre ASC").Find(&categorias).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener categorías"})
		return
	}

	c.JSON(http.StatusOK, categorias)
}

func ObtenerInscripcionesUsuario(c *gin.Context) {
	usuarioID, _ := c.Get("usuario_id")

	var inscripciones []models.Inscripcion
	if err := database.GetDB().Preload("Actividad").Preload("Actividad.Categoria").
		Where("usuario_id = ?", usuarioID).
		Order("created_at DESC").
		Find(&inscripciones).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener inscripciones"})
		return
	}

	c.JSON(http.StatusOK, inscripciones)
}
