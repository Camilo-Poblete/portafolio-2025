# App definition for gunicorn
from portfolio_project.wsgi import application as app

# Para desarrollo local o entornos sin gunicorn
if __name__ == "__main__":
    import os
    from django.core.management import execute_from_command_line
    execute_from_command_line(["manage.py", "runserver", "0.0.0.0:5000"])