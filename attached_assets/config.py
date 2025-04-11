"""
Archivo de configuración para la aplicación.
"""
import os
from pathlib import Path

class Config:
    """Base configuration class for the application."""
    # Configuración de la aplicación
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-for-portfolio')
    SESSION_TYPE = 'filesystem'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True') == 'True'
    
    # Carpeta raíz del proyecto
    ROOT_DIR = Path(__file__).resolve().parent
    
    # Configuración de la base de datos
    # Sin base de datos por ahora
    
    # Configuración del servidor de correo
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', '')
    
    # Información del portfolio
    PORTFOLIO_OWNER = os.environ.get('PORTFOLIO_OWNER', 'Camilo Poblete')
    PORTFOLIO_TITLE = os.environ.get('PORTFOLIO_TITLE', 'Portfolio Profesional de Desarrollo')
    PORTFOLIO_EMAIL = os.environ.get('PORTFOLIO_EMAIL', 'camilo.poblete@example.com')
    PORTFOLIO_GITHUB = os.environ.get('PORTFOLIO_GITHUB', 'https://github.com/camilopoblete')
    PORTFOLIO_LINKEDIN = os.environ.get('PORTFOLIO_LINKEDIN', 'https://linkedin.com/in/camilopoblete')
    PORTFOLIO_TWITTER = os.environ.get('PORTFOLIO_TWITTER', 'https://twitter.com/camilopoblete')
