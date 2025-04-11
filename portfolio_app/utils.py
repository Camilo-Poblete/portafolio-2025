"""
Utility functions for the portfolio application.
"""
import os
import re
from collections import defaultdict

from email_validator import validate_email, EmailNotValidError
from django.conf import settings

def validate_email_address(email):
    """Validate email address format."""
    try:
        # Validate & get info
        v = validate_email(email)
        # Replace with normalized form
        return True, v.email
    except EmailNotValidError as e:
        # Email is not valid
        return False, str(e)

def get_unique_categories(projects):
    """Extract unique project categories."""
    categories = set()
    for project in projects:
        categories.update(project.get('categories', []))
    return sorted(list(categories))

def get_unique_technologies(projects):
    """Extract unique technologies used in projects."""
    technologies = set()
    for project in projects:
        technologies.update(project.get('technologies', []))
    return sorted(list(technologies))

def get_tech_categories(projects):
    """Extract all technology categories from projects."""
    categories = set()
    for project in projects:
        if 'tech_categories' in project:
            categories.update(project['tech_categories'].keys())
    return sorted(list(categories))

def get_technologies_by_category(projects):
    """Group technologies by their categories."""
    result = defaultdict(set)
    for project in projects:
        if 'tech_categories' in project:
            for category, techs in project['tech_categories'].items():
                result[category].update(techs)
    
    # Convert to sorted lists
    return {category: sorted(list(techs)) for category, techs in result.items()}

def truncate_text(text, max_length=200):
    """Truncate text to a maximum length."""
    if len(text) <= max_length:
        return text
    
    # Try to truncate at the last space before max_length
    truncated = text[:max_length]
    last_space = truncated.rfind(' ')
    
    if last_space > 0:
        truncated = truncated[:last_space]
    
    return truncated + '...'

def get_common_context():
    """Return common context data for all templates."""
    return {
        'site_name': 'Camilo Poblete - Portfolio',
        'owner_name': 'Camilo Poblete',
        'owner_title': 'Desarrollador Full Stack & Ingeniero de Software',
        'owner_email': 'camilo.poblete@example.com',
        'owner_github': 'https://github.com/camilopoblete',
        'owner_linkedin': 'https://linkedin.com/in/camilopoblete',
        'owner_twitter': 'https://twitter.com/camilopoblete',
        'current_year': '2025'
    }