const { useState, useEffect } = React;

// Iconos simples en SVG (reemplazo de Lucide React)
const Icons = {
    Search: () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('circle', { cx: 11, cy: 11, r: 8 }),
        React.createElement('path', { d: 'm21 21-4.35-4.35' })
    ),
    User: () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
        React.createElement('circle', { cx: 12, cy: 7, r: 4 })
    ),
    Clock: () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('circle', { cx: 12, cy: 12, r: 10 }),
        React.createElement('polyline', { points: '12,6 12,12 16,14' })
    ),
    Users: () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
        React.createElement('circle', { cx: 9, cy: 7, r: 4 }),
        React.createElement('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
        React.createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ),
    ChevronRight: () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('polyline', { points: '9,18 15,12 9,6' })
    ),
    Menu: () => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('line', { x1: 4, y1: 12, x2: 20, y2: 12 }),
        React.createElement('line', { x1: 4, y1: 6, x2: 20, y2: 6 }),
        React.createElement('line', { x1: 4, y1: 18, x2: 20, y2: 18 })
    ),
    X: () => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
        React.createElement('line', { x1: 6, y1: 6, x2: 18, y2: 18 })
    ),
    DollarSign: () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('line', { x1: 12, y1: 1, x2: 12, y2: 23 }),
        React.createElement('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' })
    ),
    Award: () => React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
        React.createElement('circle', { cx: 12, cy: 8, r: 7 }),
        React.createElement('polyline', { points: '8.21,13.89 7,23 12,20 17,23 15.79,13.88' })
    )
};

const GymApp = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('all');
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ nombre: '', email: '', password: '', telefono: '' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [activities, setActivities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // API Base URL
    const API_BASE = '';

    // Cargar actividades al inicio
    useEffect(() => {
        loadActivities();
        loadCategories();
    }, []);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/activities`);
            if (response.ok) {
                const data = await response.json();
                setActivities(data);
            }
        } catch (error) {
            console.error('Error loading activities:', error);
            // Datos de fallback para demo
            setActivities([
                {
                    id: 1,
                    nombre: 'Yoga Matutino',
                    categoria_nombre: 'Yoga',
                    instructor: 'María González',
                    horario: 'Lunes a Viernes 07:00-08:00',
                    duracion: '60 minutos',
                    cap_maxima: 20,
                    inscritos_actuales: 15,
                    cupos_disponibles: 5,
                    estado_cupos: 'Disponible',
                    precio: 25.00,
                    nivel: 'principiante',
                    imagen: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
                    descripcion: 'Comienza tu día con una sesión relajante de yoga que te ayudará a conectar cuerpo y mente.',
                    equipamiento: 'Mat de yoga incluido, bloques, correas'
                },
                {
                    id: 2,
                    nombre: 'CrossFit Intensivo',
                    categoria_nombre: 'CrossFit',
                    instructor: 'Carlos Rodríguez',
                    horario: 'Lunes, Miércoles, Viernes 18:00-19:00',
                    duracion: '60 minutos',
                    cap_maxima: 15,
                    inscritos_actuales: 12,
                    cupos_disponibles: 3,
                    estado_cupos: 'Casi Completa',
                    precio: 40.00,
                    nivel: 'avanzado',
                    imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                    descripcion: 'Entrenamiento funcional de alta intensidad que combina halterofilia, gimnasia y ejercicios cardiovasculares.',
                    equipamiento: 'Barras olímpicas, pesas, kettlebells, cajones'
                },
                {
                    id: 3,
                    nombre: 'Pilates Reformer',
                    categoria_nombre: 'Pilates',
                    instructor: 'Ana Martínez',
                    horario: 'Lunes, Miércoles, Viernes 10:00-11:00',
                    duracion: '60 minutos',
                    cap_maxima: 8,
                    inscritos_actuales: 6,
                    cupos_disponibles: 2,
                    estado_cupos: 'Casi Completa',
                    precio: 45.00,
                    nivel: 'intermedio',
                    imagen: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
                    descripcion: 'Fortalece tu core y mejora tu postura con ejercicios precisos en el reformer.',
                    equipamiento: 'Reformer Pilates, pelotas, bandas'
                },
                {
                    id: 4,
                    nombre: 'Spinning',
                    categoria_nombre: 'Cardio',
                    instructor: 'Luis Torres',
                    horario: 'Lunes a Viernes 19:00-19:45',
                    duracion: '45 minutos',
                    cap_maxima: 25,
                    inscritos_actuales: 20,
                    cupos_disponibles: 5,
                    estado_cupos: 'Disponible',
                    precio: 20.00,
                    nivel: 'intermedio',
                    imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                    descripcion: 'Quema calorías y mejora tu resistencia cardiovascular con música motivante.',
                    equipamiento: 'Bicicletas estáticas, sistema de sonido'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data.map(cat => cat.nombre));
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            // Extraer categorías de las actividades
            const uniqueCategories = [...new Set(activities.map(activity => activity.categoria_nombre))];
            setCategories(uniqueCategories);
        }
    };

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.horario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.categoria_nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = searchCategory === 'all' || activity.categoria_nombre === searchCategory;
        return matchesSearch && matchesCategory;
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.usuario);
                setShowLogin(false);
                setLoginForm({ email: '', password: '' });
            } else {
                const error = await response.json();
                alert(error.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Simulación para demo
            setUser({ nombre: 'Usuario Demo', email: loginForm.email, rol: 'miembro' });
            setShowLogin(false);
            setLoginForm({ email: '', password: '' });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerForm)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.usuario);
                setShowLogin(false);
                setRegisterForm({ nombre: '', email: '', password: '', telefono: '' });
                setIsRegistering(false);
            } else {
                const error = await response.json();
                alert(error.error || 'Error al registrarse');
            }
        } catch (error) {
            console.error('Register error:', error);
            // Simulación para demo
            setUser({ nombre: registerForm.nombre, email: registerForm.email, rol: 'miembro' });
            setShowLogin(false);
            setRegisterForm({ nombre: '', email: '', password: '', telefono: '' });
            setIsRegistering(false);
        }
    };

    const handleEnroll = async (activityId) => {
        if (!user) {
            setShowLogin(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/activities/${activityId}/enroll`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                loadActivities(); // Recargar actividades
            } else {
                const error = await response.json();
                alert(error.error || 'Error al inscribirse');
            }
        } catch (error) {
            console.error('Enroll error:', error);
            // Simulación para demo
            const updatedActivities = activities.map(activity => {
                if (activity.id === activityId) {
                    const newInscritos = activity.inscritos_actuales + 1;
                    const newDisponibles = activity.cap_maxima - newInscritos;
                    let newEstado = 'Disponible';

                    if (newInscritos >= activity.cap_maxima) {
                        newEstado = 'Completa';
                    } else if (newInscritos >= activity.cap_maxima * 0.8) {
                        newEstado = 'Casi Completa';
                    }

                    return {
                        ...activity,
                        inscritos_actuales: newInscritos,
                        cupos_disponibles: newDisponibles,
                        estado_cupos: newEstado
                    };
                }
                return activity;
            });

            setActivities(updatedActivities);

            const activity = activities.find(a => a.id === activityId);
            if (activity.inscritos_actuales >= activity.cap_maxima) {
                alert('Actividad completa. Te hemos agregado a la lista de espera.');
            } else {
                alert('¡Inscripción exitosa! Te esperamos en la clase.');
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    const getLevelColor = (nivel) => {
        switch (nivel) {
            case 'principiante': return 'bg-green-100 text-green-800';
            case 'intermedio': return 'bg-yellow-100 text-yellow-800';
            case 'avanzado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Disponible': return 'text-green-600';
            case 'Casi Completa': return 'text-yellow-600';
            case 'Completa': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const ActivityCard = ({ activity, onClick }) => (
        React.createElement('div', {
                className: "bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer card-hover",
                onClick: () => onClick(activity)
            },
            React.createElement('div', { className: "relative h-48 overflow-hidden" },
                React.createElement('img', {
                    src: activity.imagen,
                    alt: activity.nombre,
                    className: "w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                }),
                React.createElement('div', { className: "absolute top-3 right-3 glass-effect rounded-full px-3 py-1 text-xs font-medium text-gray-700" },
                    activity.categoria_nombre
                ),
                React.createElement('div', { className: "absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold" },
                    formatPrice(activity.precio)
                ),
                React.createElement('div', { className: `absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(activity.nivel)}` },
                    activity.nivel
                )
            ),
            React.createElement('div', { className: "p-6" },
                React.createElement('h3', { className: "font-semibold text-lg text-gray-900 mb-2" }, activity.nombre),
                React.createElement('div', { className: "space-y-2 text-sm text-gray-600 mb-4" },
                    React.createElement('div', { className: "flex items-center gap-2" },
                        React.createElement(Icons.User),
                        React.createElement('span', null, activity.instructor)
                    ),
                    React.createElement('div', { className: "flex items-center gap-2" },
                        React.createElement(Icons.Clock),
                        React.createElement('span', null, activity.horario)
                    ),
                    React.createElement('div', { className: "flex items-center gap-2" },
                        React.createElement(Icons.Users),
                        React.createElement('span', null, `${activity.inscritos_actuales}/${activity.cap_maxima} inscritos`)
                    )
                ),
                React.createElement('div', { className: "flex items-center justify-between" },
                    React.createElement('span', { className: `text-xs font-medium ${getStatusColor(activity.estado_cupos)}` },
                        activity.estado_cupos
                    ),
                    React.createElement('span', { className: "text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full" },
                        activity.duracion
                    )
                )
            )
        )
    );

    const HomePage = () => (
        React.createElement('div', { className: "min-h-screen" },
            // Hero Section
            React.createElement('section', { className: "relative h-screen flex items-center justify-center hero-bg text-white overflow-hidden" },
                React.createElement('div', { className: "floating-elements" },
                    React.createElement('div', { className: "floating-element" }),
                    React.createElement('div', { className: "floating-element" }),
                    React.createElement('div', { className: "floating-element" })
                ),
                React.createElement('div', { className: "relative z-10 text-center max-w-4xl mx-auto px-6" },
                    React.createElement('h1', { className: "text-5xl md:text-7xl font-bold mb-6 animate-fade-in" },
                        React.createElement('span', { className: "gradient-text" }, "Transforma"),
                        React.createElement('br'),
                        React.createElement('span', { className: "text-white" }, "tu vida")
                    ),
                    React.createElement('p', { className: "text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed" },
                        "Descubre tu mejor versión en nuestro gimnasio. Clases personalizadas, instructores certificados y un ambiente motivador."
                    ),
                    React.createElement('button', {
                        onClick: () => setCurrentPage('activities'),
                        className: "bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    }, "Explorar Actividades")
                )
            ),
            // Featured Activities
            React.createElement('section', { className: "py-20 bg-gray-50" },
                React.createElement('div', { className: "max-w-7xl mx-auto px-6" },
                    React.createElement('div', { className: "text-center mb-16" },
                        React.createElement('h2', { className: "text-4xl font-bold text-gray-900 mb-4" }, "Actividades Destacadas"),
                        React.createElement('p', { className: "text-xl text-gray-600 max-w-2xl mx-auto" },
                            "Descubre nuestras clases más populares diseñadas para todos los niveles"
                        )
                    ),
                    React.createElement('div', { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8" },
                        activities.slice(0, 3).map((activity, index) =>
                            React.createElement('div', { key: activity.id, className: `animate-slide-up delay-${index * 200}` },
                                React.createElement(ActivityCard, {
                                    activity: activity,
                                    onClick: (act) => {
                                        setSelectedActivity(act);
                                        setCurrentPage('detail');
                                    }
                                })
                            )
                        )
                    ),
                    React.createElement('div', { className: "text-center mt-12" },
                        React.createElement('button', {
                            onClick: () => setCurrentPage('activities'),
                            className: "bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                        }, "Ver Todas las Actividades")
                    )
                )
            )
        )
    );

    const ActivitiesPage = () => (
        React.createElement('div', { className: "min-h-screen bg-gray-50 pt-24" },
            React.createElement('div', { className: "max-w-7xl mx-auto px-6" },
                React.createElement('div', { className: "mb-8" },
                    React.createElement('h1', { className: "text-4xl font-bold text-gray-900 mb-4" }, "Nuestras Actividades"),
                    React.createElement('p', { className: "text-xl text-gray-600" }, "Encuentra la actividad perfecta para ti")
                ),
                // Search and Filter
                React.createElement('div', { className: "glass-effect rounded-xl shadow-sm p-6 mb-8" },
                    React.createElement('div', { className: "flex flex-col md:flex-row gap-4" },
                        React.createElement('div', { className: "flex-1 relative" },
                            React.createElement('div', { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" },
                                React.createElement(Icons.Search)
                            ),
                            React.createElement('input', {
                                type: "text",
                                placeholder: "Buscar por nombre, instructor o horario...",
                                className: "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                                value: searchTerm,
                                onChange: (e) => setSearchTerm(e.target.value)
                            })
                        ),
                        React.createElement('select', {
                                className: "px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                                value: searchCategory,
                                onChange: (e) => setSearchCategory(e.target.value)
                            },
                            React.createElement('option', { value: "all" }, "Todas las categorías"),
                            categories.map(category =>
                                React.createElement('option', { key: category, value: category }, category)
                            )
                        )
                    )
                ),
                // Activities Grid
                loading ?
                    React.createElement('div', { className: "text-center py-12" },
                        React.createElement('p', { className: "text-gray-500 text-lg" }, "Cargando actividades...")
                    ) :
                    React.createElement('div', { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6" },
                        filteredActivities.map((activity) =>
                            React.createElement(ActivityCard, {
                                key: activity.id,
                                activity: activity,
                                onClick: (act) => {
                                    setSelectedActivity(act);
                                    setCurrentPage('detail');
                                }
                            })
                        )
                    ),
                filteredActivities.length === 0 && !loading &&
                React.createElement('div', { className: "text-center py-12" },
                    React.createElement('p', { className: "text-gray-500 text-lg" }, "No se encontraron actividades que coincidan con tu búsqueda.")
                )
            )
        )
    );

    const ActivityDetail = () => {
        if (!selectedActivity) return null;

        return React.createElement('div', { className: "min-h-screen bg-gray-50 pt-24" },
            React.createElement('div', { className: "max-w-4xl mx-auto px-6" },
                React.createElement('button', {
                        onClick: () => setCurrentPage('activities'),
                        className: "flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    },
                    React.createElement('div', { className: "rotate-180 mr-2" }, React.createElement(Icons.ChevronRight)),
                    "Volver a actividades"
                ),
                React.createElement('div', { className: "bg-white rounded-xl shadow-sm overflow-hidden" },
                    React.createElement('div', { className: "h-64 md:h-80 relative" },
                        React.createElement('img', {
                            src: selectedActivity.imagen,
                            alt: selectedActivity.nombre,
                            className: "w-full h-full object-cover"
                        }),
                        React.createElement('div', { className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" }),
                        React.createElement('div', { className: "absolute bottom-6 left-6 text-white" },
                            React.createElement('h1', { className: "text-3xl md:text-4xl font-bold mb-2" }, selectedActivity.nombre),
                            React.createElement('p', { className: "text-lg opacity-90" }, selectedActivity.categoria_nombre)
                        )
                    ),
                    React.createElement('div', { className: "p-8" },
                        React.createElement('div', { className: "grid md:grid-cols-2 gap-8 mb-8" },
                            React.createElement('div', null,
                                React.createElement('h3', { className: "font-semibold text-lg mb-4" }, "Detalles de la Clase"),
                                React.createElement('div', { className: "space-y-3" },
                                    React.createElement('div', { className: "flex items-center gap-3" },
                                        React.createElement(Icons.User, { className: "text-gray-400" }),
                                        React.createElement('span', null, React.createElement('strong', null, "Instructor: "), selectedActivity.instructor)
                                    ),
                                    React.createElement('div', { className: "flex items-center gap-3" },
                                        React.createElement(Icons.Clock, { className: "text-gray-400" }),
                                        React.createElement('span', null, React.createElement('strong', null, "Horario: "), selectedActivity.horario)
                                    ),
                                    React.createElement('div', { className: "flex items-center gap-3" },
                                        React.createElement(Icons.Users, { className: "text-gray-400" }),
                                        React.createElement('span', null, React.createElement('strong', null, "Capacidad: "), `${selectedActivity.inscritos_actuales}/${selectedActivity.cap_maxima} personas`)
                                    ),
                                    React.createElement('div', { className: "flex items-center gap-3" },
                                        React.createElement(Icons.DollarSign, { className: "text-gray-400" }),
                                        React.createElement('span', null, React.createElement('strong', null, "Precio: "), formatPrice(selectedActivity.precio))
                                    )
                                )
                            ),
                            React.createElement('div', null,
                                React.createElement('h3', { className: "font-semibold text-lg mb-4" }, "Información Adicional"),
                                React.createElement('div', { className: "space-y-3" },
                                    React.createElement('div', null,
                                        React.createElement('span', { className: "font-medium" }, "Nivel: "),
                                        React.createElement('span', { className: `ml-2 px-2 py-1 rounded text-sm ${getLevelColor(selectedActivity.nivel)}` }, selectedActivity.nivel)
                                    ),
                                    React.createElement('div', null,
                                        React.createElement('span', { className: "font-medium" }, "Duración: "),
                                        React.createElement('span', { className: "ml-2" }, selectedActivity.duracion)
                                    ),
                                    React.createElement('div', null,
                                        React.createElement('span', { className: "font-medium" }, "Equipamiento: "),
                                        React.createElement('p', { className: "text-gray-600 mt-1" }, selectedActivity.equipamiento)
                                    ),
                                    React.createElement('div', null,
                                        React.createElement('span', { className: "font-medium" }, "Estado: "),
                                        React.createElement('span', { className: `ml-2 font-medium ${getStatusColor(selectedActivity.estado_cupos)}` }, selectedActivity.estado_cupos)
                                    )
                                )
                            )
                        ),
                        React.createElement('div', { className: "mb-8" },
                            React.createElement('h3', { className: "font-semibold text-lg mb-4" }, "Descripción"),
                            React.createElement('p', { className: "text-gray-700 leading-relaxed" }, selectedActivity.descripcion)
                        ),
                        React.createElement('div', { className: "flex flex-col sm:flex-row gap-4" },
                            React.createElement('button', {
                                onClick: () => handleEnroll(selectedActivity.id),
                                disabled: selectedActivity.estado_cupos === 'Completa',
                                className: `flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                    selectedActivity.estado_cupos === 'Completa'
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105'
                                }`
                            }, selectedActivity.estado_cupos === 'Completa' ? 'Clase Llena' : 'Inscribirse'),
                            React.createElement('button', { className: "px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors" },
                                "Compartir"
                            )
                        )
                    )
                )
            )
        );
    };

    const LoginModal = () => (
        React.createElement('div', { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" },
            React.createElement('div', { className: "glass-effect rounded-xl max-w-md w-full p-6" },
                React.createElement('div', { className: "flex justify-between items-center mb-6" },
                    React.createElement('h2', { className: "text-2xl font-bold" }, isRegistering ? 'Registro' : 'Iniciar Sesión'),
                    React.createElement('button', {
                        onClick: () => setShowLogin(false),
                        className: "text-gray-400 hover:text-gray-600"
                    }, React.createElement(Icons.X))
                ),
                React.createElement('div', null,
                    isRegistering &&
                    React.createElement('div', { className: "mb-4" },
                        React.createElement('label', { className: "block text-sm font-medium mb-2" }, "Nombre Completo"),
                        React.createElement('input', {
                            type: "text",
                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                            value: registerForm.nombre,
                            onChange: (e) => setRegisterForm({...registerForm, nombre: e.target.value})
                        })
                    ),
                    isRegistering &&
                    React.createElement('div', { className: "mb-4" },
                        React.createElement('label', { className: "block text-sm font-medium mb-2" }, "Teléfono"),
                        React.createElement('input', {
                            type: "tel",
                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                            value: registerForm.telefono,
                            onChange: (e) => setRegisterForm({...registerForm, telefono: e.target.value})
                        })
                    ),
                    React.createElement('div', { className: "mb-4" },
                        React.createElement('label', { className: "block text-sm font-medium mb-2" }, "Email"),
                        React.createElement('input', {
                            type: "email",
                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                            value: isRegistering ? registerForm.email : loginForm.email,
                            onChange: (e) => isRegistering
                                ? setRegisterForm({...registerForm, email: e.target.value})
                                : setLoginForm({...loginForm, email: e.target.value})
                        })
                    ),
                    React.createElement('div', { className: "mb-6" },
                        React.createElement('label', { className: "block text-sm font-medium mb-2" }, "Contraseña"),
                        React.createElement('input', {
                            type: "password",
                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                            value: isRegistering ? registerForm.password : loginForm.password,
                            onChange: (e) => isRegistering
                                ? setRegisterForm({...registerForm, password: e.target.value})
                                : setLoginForm({...loginForm, password: e.target.value})
                        })
                    ),
                    React.createElement('button', {
                        onClick: isRegistering ? handleRegister : handleLogin,
                        className: "w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    }, isRegistering ? 'Registrarse' : 'Iniciar Sesión')
                ),
                React.createElement('div', { className: "mt-4 text-center" },
                    React.createElement('button', {
                        onClick: () => setIsRegistering(!isRegistering),
                        className: "text-gray-600 hover:text-gray-800"
                    }, isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate')
                )
            )
        )
    );

    return React.createElement('div', { className: "min-h-screen bg-white" },
        // Navigation
        React.createElement('nav', { className: "fixed top-0 w-full glass-effect z-40 shadow-sm" },
            React.createElement('div', { className: "max-w-7xl mx-auto px-6" },
                React.createElement('div', { className: "flex justify-between items-center h-16" },
                    React.createElement('div', { className: "flex items-center" },
                        React.createElement('h1', { className: "text-2xl font-bold text-gray-900" }, "FitGym")
                    ),
                    // Desktop Navigation
                    React.createElement('div', { className: "hidden md:flex items-center space-x-8" },
                        React.createElement('button', {
                            onClick: () => setCurrentPage('home'),
                            className: `transition-colors ${currentPage === 'home' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`
                        }, "Inicio"),
                        React.createElement('button', {
                            onClick: () => setCurrentPage('activities'),
                            className: `transition-colors ${currentPage === 'activities' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`
                        }, "Actividades"),
                        user ?
                            React.createElement('div', { className: "flex items-center gap-4" },
                                React.createElement('span', { className: "text-gray-700" }, `Hola, ${user.nombre}`),
                                React.createElement('button', {
                                    onClick: () => {
                                        setUser(null);
                                        localStorage.removeItem('token');
                                    },
                                    className: "text-gray-600 hover:text-gray-900"
                                }, "Cerrar Sesión")
                            ) :
                            React.createElement('button', {
                                onClick: () => setShowLogin(true),
                                className: "bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            }, "Iniciar Sesión")
                    ),
                    // Mobile menu button
                    React.createElement('button', {
                        className: "md:hidden",
                        onClick: () => setMobileMenuOpen(!mobileMenuOpen)
                    }, mobileMenuOpen ? React.createElement(Icons.X) : React.createElement(Icons.Menu))
                )
            ),
            // Mobile Navigation
            mobileMenuOpen &&
            React.createElement('div', { className: "md:hidden glass-effect border-t" },
                React.createElement('div', { className: "px-6 py-4 space-y-4" },
                    React.createElement('button', {
                        onClick: () => {setCurrentPage('home'); setMobileMenuOpen(false);},
                        className: "block w-full text-left text-gray-600 hover:text-gray-900"
                    }, "Inicio"),
                    React.createElement('button', {
                        onClick: () => {setCurrentPage('activities'); setMobileMenuOpen(false);},
                        className: "block w-full text-left text-gray-600 hover:text-gray-900"
                    }, "Actividades"),
                    user ?
                        React.createElement('div', { className: "space-y-2" },
                            React.createElement('p', { className: "text-gray-700" }, `Hola, ${user.nombre}`),
                            React.createElement('button', {
                                onClick: () => {
                                    setUser(null);
                                    localStorage.removeItem('token');
                                    setMobileMenuOpen(false);
                                },
                                className: "block w-full text-left text-gray-600 hover:text-gray-900"
                            }, "Cerrar Sesión")
                        ) :
                        React.createElement('button', {
                            onClick: () => {setShowLogin(true); setMobileMenuOpen(false);},
                            className: "bg-gray-900 text-white px-4 py-2 rounded-lg"
                        }, "Iniciar Sesión")
                )
            )
        ),
        // Page Content
        currentPage === 'home' && React.createElement(HomePage),
        currentPage === 'activities' && React.createElement(ActivitiesPage),
        currentPage === 'detail' && React.createElement(ActivityDetail),
        // Login Modal
        showLogin && React.createElement(LoginModal)
    );
};

// Render the app
ReactDOM.render(React.createElement(GymApp), document.getElementById('root'));