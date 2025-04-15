"""
Data models for the portfolio application.
Since we're not using a database, we'll store the data in Python structures.
"""
import os
from django.conf import settings

from django.db import models
from django.utils.translation import gettext_lazy as _



class TechnologyCategory(models.Model):
    name = models.CharField(_("Nombre"), max_length=100)
    
    class Meta:
        verbose_name = _("Categoría de Tecnología")
        verbose_name_plural = _("Categorías de Tecnologías")
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Technology(models.Model):
    name = models.CharField(_("Nombre"), max_length=100)
    category = models.ForeignKey(TechnologyCategory, on_delete=models.CASCADE, related_name='technologies')
    
    class Meta:
        verbose_name = _("Tecnología")
        verbose_name_plural = _("Tecnologías")
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Certificacion(models.Model):
    titulo = models.CharField(_("Título"), max_length=200)
    organizacion = models.CharField(_("Organización"), max_length=100)
    fecha_obtencion = models.DateField(_("Fecha de Obtención"))
    fecha_expiracion = models.DateField(_("Fecha de Expiración"), blank=True, null=True)
    descripcion = models.TextField(null=True, blank=True)
    imagen = models.FileField(upload_to='static/media/images/', null=True, blank=True)  # Eliminado 'certifications/'
    archivo_pdf = models.FileField(_("PDF del Certificado"), upload_to='static/media/images/', blank=True, null=True)  # Eliminado 'certifications/'
    url_verificacion = models.URLField(_("URL de Verificación"), blank=True, null=True)
    technologies = models.ManyToManyField(Technology, related_name='certificaciones', blank=True)
    
    class Meta:
        verbose_name = _("Certificación")
        verbose_name_plural = _("Certificaciones")
        ordering = ['-fecha_obtencion']
    
    def __str__(self):
        return self.titulo
    
    @property
    def tech_list(self):
        return [tech.name for tech in self.technologies.all()]
        
    @property
    def tech_categories(self):
        categories = set()
        for tech in self.technologies.all():
            categories.add(tech.category.name)
        return list(categories)


def get_technology_categories():
    """Return all unique technology categories from projects."""
    categories = set()
    for project in get_projects():
        for category in project['tech_categories'].keys():
            categories.add(category)
    return sorted(list(categories))



def get_technologies_by_category():
    """Return all technologies organized by category."""
    tech_by_category = {}
    
    # Initialize with empty lists for all categories
    for category in get_technology_categories():
        tech_by_category[category] = []
    
    # Fill with technologies from all projects
    for project in get_projects():
        for category, technologies in project['tech_categories'].items():
            for tech in technologies:
                if tech not in tech_by_category[category]:
                    tech_by_category[category].append(tech)
    
    # Sort technologies alphabetically within each category
    for category in tech_by_category:
        tech_by_category[category].sort()
        
    return tech_by_category



def get_all_technologies():
    """Return a list of all unique technologies across all projects."""
    all_techs = set()
    for project in get_projects():
        for tech in project['technologies']:
            all_techs.add(tech)
    return sorted(list(all_techs))





def get_projects():
    """Return a list of projects."""
    return [
        {
            'id': 1,
            'title': ' Yokanjeo ',
            'short_description': 'Busqueda de propiedades...',
           'short_description': 'Plataforma para búsqueda y publicación de propiedades inmobiliarias.',
           'long_description': 'Desarrollo completo de una aplicación web para gestión de propiedades, con autenticación de usuarios, filtrado avanzado, integración con mapas y panel administrativo.',
           'categories': ['Desarrollo Web', 'Inmobiliaria'],
           'technologies': ['ASP.NET Core', 'Entity Framework Core', 'SQL Server', 'Razor Pages', 'SignalR', 'Azure'],
            'tech_categories': {
                 'Lenguajes de Programación': ['C#'],
                  'Frameworks': ['ASP.NET Core', 'Entity Framework Core', 'Razor Pages'],
                   'Bases de Datos': ['SQL Server'],
                    'Realtime': ['SignalR']
                   
            },
            'image': '/static/img/projects/Yokanjeo (2).svg',
            'github_url': 'https://github.com/Camilo-Poblete/Yokanjeo',
            'live_url': 'https://ecommerce-demo.camilopoblete.com'
        },
        {
            'id': 2,
            'title': 'Restaurante',
             'short_description': 'Aplicación para gestión y pedidos en restaurantes.',
              'long_description': 'Aplicación web y móvil que permite a los restaurantes gestionar su menú, pedidos en tiempo real, reservas y estadísticas de ventas, todo respaldado por un backend en Django.',
              'categories': ['Desarrollo Web', 'Gastronomía'],
              'technologies': ['Django', 'Python', 'PostgreSQL', 'Chart.js'],
              'tech_categories': {
                'Lenguajes de Programación': ['Python', 'JavaScript', 'html', 'css'],
                'Frameworks': ['React Native', 'Redux'],
                'Bases de Datos': ['PostgreSQL'],
               
                
            },
            'image': '/static/img/projects/mobile_app.svg',
            'github_url': 'https://github.com/Camilo-Poblete/cleanFood',
            'live_url': 'juegos-dados-img.vercel.app'
        },
        {
            'id': 3,
            'title': 'Blog de base de datos',
            'short_description': 'Sistema descentralizado...',
            'long_description': 'Plataforma descentralizada...',
            'categories': ['Blockchain', 'Web3'],
            'technologies': ['Ethereum', 'Solidity', 'Web3.js', 'React', 'Node.js'],
            'tech_categories': {
                'Lenguajes de Programación': ['JavaScript', 'Solidity'],
                'Frameworks': ['React'],
                'Blockchain/Runtime': ['Ethereum', 'Web3.js', 'Node.js', 'Solidity'],  # Todo unificado: Blockchain + Runtime + Smart Contracts
            },
            'image': '/static/img/projects/mobile_app.svg',
            'github_url': 'https://github.com/camilopoblete/certchain',
            'live_url': 'https://certchain-demo.camilopoblete.com'
        },
        # ... (resto de proyectos se mantienen igual)
    
        {
            'id': 4,
            'title': 'Sistema de Gestión de Proyectos',
            'short_description': 'Aplicación para la gestión...',
            'long_description': 'Herramienta completa para la gestión...',
            'categories': ['Desarrollo Web', 'Herramientas'],
            'technologies': ['Vue.js', 'Laravel', 'MySQL', 'Docker', 'WebSockets'],
            'tech_categories': {
                'Lenguajes de Programación': ['JavaScript', 'PHP'],
                'Frameworks': ['Vue.js', 'Laravel'],
                'Bases de Datos': ['MySQL'],
                'DevOps/Cloud': ['Docker'],  # Docker ahora en DevOps/Cloud
                'Protocolos': ['WebSockets']
            },
            'image': '/static/img/projects/blockchain.svg',
            'github_url': 'https://github.com/camilopoblete/taskmaster',
            'live_url': 'https://taskmaster-demo.camilopoblete.com'
        },
        {


            'id': 5,
            'title': 'Juego de dados',
           'short_description': 'Juego interactivo hecho con JavaScript y Bootstrap.',
           'long_description': 'Aplicación web divertida donde dos jugadores lanzan dados virtuales para competir. Desarrollado usando HTML, CSS, JavaScript y Bootstrap, enfocado en la lógica del frontend.',
          'categories': ['Frontend', 'Juegos'],
          'technologies': ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
         'tech_categories': {
        'Lenguajes de Programación': ['JavaScript'],
        'Frontend': ['HTML', 'CSS', 'Bootstrap'],
        'Lógica de Juego': ['JavaScript']
    },
            'image': '/static/img/projects/mobile_app.svg',
            'github_url': 'https://github.com/Camilo-Poblete/juegosDadosImg',
            'live_url': 'https://juegos-dados-img.vercel.app/'
        },
        {
            'id': 6,
            'title': 'Plataforma de Aprendizaje Online',
            'short_description': 'Sistema LMS completo...',
            'long_description': 'Plataforma de aprendizaje...',
            'categories': ['Desarrollo Web', 'Educación'],
            'technologies': ['Angular', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
            'tech_categories': {
                'Lenguajes de Programación': ['JavaScript', 'TypeScript', 'Python'],
                'Frameworks': ['Angular', 'Django'],
                'Bases de Datos': ['PostgreSQL', 'Redis'],
                'DevOps/Cloud': ['AWS']  # AWS unificado aquí
            },
            'image': '/static/img/projects/mobile_app.svg',
            'github_url': 'https://github.com/camilopoblete/learnhub',
            'live_url': 'https://learnhub-demo.camilopoblete.com'
        }
    ]

def get_skills_by_category():
    """Return skills grouped by category."""
    return {
        'Frontend': [
            {'name': 'React', 'level': 95},
            {'name': 'Angular', 'level': 90},
            {'name': 'Vue.js', 'level': 85},
            {'name': 'JavaScript/TypeScript', 'level': 95},
            {'name': 'HTML5 & CSS3', 'level': 90},
            {'name': 'SASS/SCSS', 'level': 85},
            {'name': 'Tailwind CSS', 'level': 80},
            {'name': 'Bootstrap', 'level': 90},
            {'name': 'Redux', 'level': 85}
        ],
        'Backend': [
            {'name': 'Node.js', 'level': 90},
            {'name': 'Python', 'level': 95},
            {'name': 'Django', 'level': 90},
            {'name': 'Laravel', 'level': 85},
            {'name': 'Express', 'level': 90},
            {'name': 'FastAPI', 'level': 80},
            {'name': 'GraphQL', 'level': 75},
            {'name': 'RESTful APIs', 'level': 95}
        ],
        'Mobile': [
            {'name': 'React Native', 'level': 90},
            {'name': 'Flutter', 'level': 75},
            {'name': 'iOS/Swift', 'level': 70},
            {'name': 'Android/Kotlin', 'level': 65}
        ],
        'Bases de Datos': [
            {'name': 'MongoDB', 'level': 90},
            {'name': 'PostgreSQL', 'level': 85},
            {'name': 'MySQL', 'level': 90},
            {'name': 'Redis', 'level': 80},
            {'name': 'Firebase', 'level': 85}
        ],
        'DevOps y Cloud': [
            {'name': 'Docker', 'level': 85},
            {'name': 'Kubernetes', 'level': 75},
            {'name': 'AWS', 'level': 85},
            {'name': 'Google Cloud', 'level': 80},
            {'name': 'CI/CD', 'level': 90},
            {'name': 'GitHub Actions', 'level': 85}
        ],
        'Otras Tecnologías': [
            {'name': 'Blockchain/Web3', 'level': 75},
            {'name': 'Machine Learning', 'level': 70},
            {'name': 'WebSockets', 'level': 85},
            {'name': 'WebRTC', 'level': 75},
            {'name': 'Serverless', 'level': 80}
        ]
    }
def get_soft_skills():
    """Return soft skills without levels."""
    return [
        {'name': 'Resolución de problemas'},
        {'name': 'Comunicación efectiva'},
        {'name': 'Trabajo en equipo'},
        {'name': 'Liderazgo técnico'},
        {'name': 'Gestión del tiempo'},
        {'name': 'Adaptabilidad'},
        {'name': 'Pensamiento crítico'},
        {'name': 'Atención al detalle'}
    ]

def get_experience():
    """Return work experience."""
    return [
        {
            'position': 'Consultor Seguridad SAP JR',
            'company': 'PGA Group Solutions',
            'period': '2023',  # El periodo con año de inicio
            'description': (
                'Gestión de cuentas SAP: Creación, administración y desbloqueo de cuentas de usuario, asegurando continuidad operativa. '
                'Implementación y control de políticas de contraseñas para mejorar la seguridad y el cumplimiento normativo.'
            ),
            'achievements': [
                'Reducción del tiempo de desbloqueo de cuentas en un 40%.',
                'Automatización parcial de procesos de creación de usuarios.'
            ]
        },
        {
            'position': 'Desarrollo Front End',
            'company': 'C2C Technologies',
            'period': '2022',
            'description': (
                'Participación en el desarrollo de un módulo para el Ministerio de Economía llamado "Chequeo Digital". '
                'Se implementó exportación e importación de datos Excel y componentes frontend interactivos.'
            ),
            'achievements': [
                'Entrega exitosa del módulo con integración completa de datos.',
                'Documentación funcional entregada al cliente.'
            ]
        },
        {
            'position': 'Desarrollador .NET (Práctica Profesional)',
            'company': 'BIDATA',
            'period': '2022',
            'description': (
                'Diseño y desarrollo de un sistema web para gestión inmobiliaria. '
                'Desarrollo de funcionalidades clave utilizando ASP.NET, SQL Server y el patrón MVC.'
            ),
            'achievements': [
                'Sistema funcional desplegado en entorno de pruebas.',
                'Cumplimiento de objetivos de práctica en tiempo y forma.'
            ]
        },
        {
            'position': 'Practicante de Desarrollo de Software',
            'company': 'Akzio Ingeniería de Software',
            'period': '2021',
            'description': (
                'Apoyo en la mejora continua de aplicativos internos utilizados por QA. '
                'Participación en la toma de requerimientos usando metodologías ágiles como Lean Inception.'
            ),
            'achievements': [
                'Contribución al rediseño de una herramienta de inspección de código.',
                'Trabajo colaborativo exitoso con equipos de QA.'
            ]
        }

    ]

        






def get_education():
    """Return education background."""
    return [
        {
            'degree': 'Maestría en Ingeniería de Software',
            'institution': 'Universidad Tecnológica Nacional',
            'year': '2016 - 2018',
            'description': 'Especialización en arquitecturas de software y metodologías ágiles. Proyecto final sobre implementación de microservicios en aplicaciones de alta disponibilidad.'
        },
        {
            'degree': 'Ingeniería en Sistemas',
            'institution': 'Universidad de Santiago',
            'year': '2009 - 2013',
            'description': 'Formación en fundamentos de la programación, estructuras de datos, algoritmos, bases de datos y desarrollo de software. Graduado con honores.'
        }
    ]

def get_certifications():
    """Return professional certifications."""
    return [
        {
            'name': 'AWS Certified Solutions Architect',
            'issuer': 'Amazon Web Services',
            'year': '2021',
            'expires': '2024'
        },
        {
            'name': 'Professional Scrum Master (PSM I)',
            'issuer': 'Scrum.org',
            'year': '2020',
            'expires': 'No expira'
        },
        {
            'name': 'MongoDB Certified Developer',
            'issuer': 'MongoDB Inc.',
            'year': '2019',
            'expires': '2025'
        },
        {
            'name': 'Google Cloud Professional Developer',
            'issuer': 'Google',
            'year': '2020',
            'expires': '2023'
        }
    ]


