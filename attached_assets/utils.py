"""
Utility functions for the portfolio application.
"""

import re

def validate_email(email):
    """Validate email address format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

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

def truncate_text(text, max_length=200):
    """Truncate text to a maximum length."""
    if len(text) <= max_length:
        return text
    return text[:max_length].rsplit(' ', 1)[0] + '...'
