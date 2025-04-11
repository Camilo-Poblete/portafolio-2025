"""
Data models for the portfolio application.
Since we're not using a database, we'll store the data in Python structures.
"""
import os
from django.conf import settings



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
            'title': 'Sistema de Comercio Electrónico',
            'short_description': 'Plataforma de comercio electrónico completa...',
            'long_description': 'Desarrollo completo de una plataforma...',
            'categories': ['Desarrollo Web', 'E-commerce'],
            'technologies': ['React', 'Node.js', 'MongoDB', 'Express', 'Redux', 'AWS'],
            'tech_categories': {
                'Lenguajes de Programación': ['JavaScript'],
                'Frameworks': ['React', 'Express', 'Redux'],
                'Blockchain/Runtime': ['Node.js'],  # Runtime
                'Bases de Datos': ['MongoDB'],
                'DevOps/Cloud': ['AWS']
            },
            'image': '/static/img/projects/ecommerce.svg',
            'github_url': 'https://github.com/camilopoblete/ecommerce-platform',
            'live_url': 'https://ecommerce-demo.camilopoblete.com'
        },
        {
            'id': 2,
            'title': 'Aplicación Móvil de Finanzas Personales',
            'short_description': 'App para el seguimiento de gastos...',
            'long_description': 'Aplicación móvil para el seguimiento...',
            'categories': ['Desarrollo Móvil', 'Fintech'],
            'technologies': ['React Native', 'Firebase', 'Redux', 'D3.js', 'Node.js'],
            'tech_categories': {
                'Lenguajes de Programación': ['JavaScript'],
                'Frameworks': ['React Native', 'Redux'],
                'Blockchain/Runtime': ['Node.js'],  # Runtime
                'Bases de Datos': ['Firebase'],
                'Visualización': ['D3.js']
            },
            'image': '/static/img/projects/mobile_app.svg',
            'github_url': 'https://github.com/camilopoblete/finanzapp',
            'live_url': 'https://finanzapp.camilopoblete.com'
        },
        {
            'id': 3,
            'title': 'Plataforma Blockchain para Certificaciones',
            'short_description': 'Sistema descentralizado...',
            'long_description': 'Plataforma descentralizada...',
            'categories': ['Blockchain', 'Web3'],
            'technologies': ['Ethereum', 'Solidity', 'Web3.js', 'React', 'Node.js'],
            'tech_categories': {
                'Lenguajes de Programación': ['JavaScript', 'Solidity'],
                'Frameworks': ['React'],
                'Blockchain/Runtime': ['Ethereum', 'Web3.js', 'Node.js', 'Solidity'],  # Todo unificado: Blockchain + Runtime + Smart Contracts
            },
            'image': '/static/img/projects/blockchain.svg',
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
            'image': '/static/img/projects/project_management.svg',
            'github_url': 'https://github.com/camilopoblete/taskmaster',
            'live_url': 'https://taskmaster-demo.camilopoblete.com'
        },
        {
            'id': 5,
            'title': 'API de Inteligencia Artificial...',
            'short_description': 'API de procesamiento...',
            'long_description': 'Servicio de API que utiliza...',
            'categories': ['Inteligencia Artificial', 'APIs'],
            'technologies': ['Python', 'FastAPI', 'TensorFlow', 'spaCy', 'Redis', 'Docker'],
            'tech_categories': {
                'Lenguajes de Programación': ['Python'],
                'Frameworks': ['FastAPI', 'TensorFlow'],
                'Bases de Datos': ['Redis'],
                'DevOps/Cloud': ['Docker'],  # Docker y Redis (si es para caché) separados
                'NLP': ['spaCy']
            },
            'image': '/static/img/projects/ai_text.svg',
            'github_url': 'https://github.com/camilopoblete/textmind-api',
            'live_url': 'https://api-docs.textmind.camilopoblete.com'
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
            'image': '/static/img/projects/elearning.svg',
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
    """Return soft skills."""
    return [
        {'name': 'Resolución de problemas', 'level': 95},
        {'name': 'Comunicación efectiva', 'level': 90},
        {'name': 'Trabajo en equipo', 'level': 95},
        {'name': 'Liderazgo técnico', 'level': 85},
        {'name': 'Gestión del tiempo', 'level': 90},
        {'name': 'Adaptabilidad', 'level': 95},
        {'name': 'Pensamiento crítico', 'level': 90},
        {'name': 'Atención al detalle', 'level': 95}
    ]

def get_experience():
    """Return work experience."""
    return [
        {
            'position': 'Senior Full Stack Developer',
            'company': 'TechInnovate Solutions',
            'period': '2020 - Presente',
            'description': 'Lideré el desarrollo de aplicaciones web y móviles para clientes de diversos sectores. Implementé arquitecturas escalables utilizando microservicios, contenedores Docker y despliegues en la nube. Mentorización de desarrolladores junior y participación en decisiones técnicas estratégicas.'
        },
        {
            'position': 'Frontend Team Lead',
            'company': 'DigitalWave Agency',
            'period': '2018 - 2020',
            'description': 'Dirigí un equipo de 8 desarrolladores frontend en la creación de interfaces de usuario para aplicaciones empresariales. Establecí estándares de código, implementé workflows de CI/CD, y mejoré significativamente la calidad del código y la velocidad de entrega.'
        },
        {
            'position': 'Software Engineer',
            'company': 'GlobalTech',
            'period': '2015 - 2018',
            'description': 'Desarrollé y mantuve aplicaciones web utilizando Angular, React y Node.js. Colaboré en equipos ágiles internacionales, participando en todas las fases del ciclo de desarrollo de software, desde la planificación hasta la implementación y monitoreo.'
        },
        {
            'position': 'Desarrollador Web',
            'company': 'CreaSoft',
            'period': '2013 - 2015',
            'description': 'Implementé sitios web y aplicaciones para pequeñas y medianas empresas utilizando PHP, JavaScript y MySQL. Gestioné proyectos completos, desde el diseño inicial hasta el despliegue y mantenimiento.'
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