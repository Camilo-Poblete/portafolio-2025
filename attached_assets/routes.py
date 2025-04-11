from flask import render_template, request, redirect, url_for, flash, jsonify
from app import app, mail
from flask_mail import Message
from models import projects, skills, work_experience
from utils import get_unique_categories, get_unique_technologies, truncate_text, validate_email
import logging
from datetime import datetime

@app.route('/')
def index():
    """Render the home page."""
    # Obtener tecnologías únicas para los filtros
    technologies = get_unique_technologies(projects)
    
    return render_template('index_projects.html', 
                           title='Home', 
                           projects=projects,
                           skills=skills,
                           technologies=technologies,
                           now=datetime.now(),
                           get_unique_categories=get_unique_categories,
                           get_unique_technologies=get_unique_technologies,
                           truncate_text=truncate_text)

@app.route('/projects')
def project_list():
    """Redirigir a la página principal con proyectos."""
    return redirect(url_for('index') + '#projects')

@app.route('/projects/<category>')
def project_by_category(category):
    """Filter projects by category."""
    filtered_projects = [p for p in projects if category in p['categories']]
    return render_template('projects.html', 
                           title=f'Projects - {category}', 
                           projects=filtered_projects,
                           active_category=category,
                           now=datetime.now(),
                           get_unique_categories=get_unique_categories,
                           get_unique_technologies=get_unique_technologies,
                           truncate_text=truncate_text)

@app.route('/skills')
def skill_list():
    """Render the skills page."""
    return render_template('skills.html', 
                           title='Skills', 
                           skills=skills,
                           now=datetime.now(),
                           get_unique_categories=get_unique_categories,
                           get_unique_technologies=get_unique_technologies,
                           truncate_text=truncate_text)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Handle the contact page and form submission."""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        if not all([name, email, subject, message]):
            flash('Por favor, completa todos los campos.', 'error')
            return redirect(url_for('contact'))
        
        if not validate_email(email):
            flash('Por favor, ingresa una dirección de correo electrónico válida.', 'error')
            return redirect(url_for('contact'))
            
        try:
            # Create email message
            msg = Message(
                subject=f"Contacto Portfolio: {subject}",
                recipients=[app.config['MAIL_DEFAULT_SENDER']],
                body=f"Nombre: {name}\nEmail: {email}\n\nMensaje:\n{message}",
                sender=app.config['MAIL_DEFAULT_SENDER']
            )
            # Send email
            mail.send(msg)
            
            flash('¡Tu mensaje ha sido enviado exitosamente!', 'success')
            return redirect(url_for('index') + '#contact')
        except Exception as e:
            logging.error(f"Error sending email: {str(e)}")
            flash('Ocurrió un error al enviar tu mensaje. Por favor, intenta nuevamente más tarde.', 'error')
            return redirect(url_for('index') + '#contact')
            
    # Obtener tecnologías únicas para los filtros
    technologies = get_unique_technologies(projects)
    
    return render_template('contact.html', 
                          title='Contacto', 
                          projects=projects,
                          technologies=technologies,
                          now=datetime.now(),
                          get_unique_categories=get_unique_categories,
                          get_unique_technologies=get_unique_technologies,
                          truncate_text=truncate_text)

@app.route('/api/projects')
def api_projects():
    """API endpoint to get projects as JSON."""
    category = request.args.get('category')
    technology = request.args.get('technology')
    
    filtered_projects = projects
    
    if category:
        filtered_projects = [p for p in filtered_projects if category in p['categories']]
    
    if technology:
        filtered_projects = [p for p in filtered_projects if technology in p['technologies']]
        
    return jsonify(filtered_projects)

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors."""
    technologies = get_unique_technologies(projects)
    
    return render_template('index_projects.html', 
                          error="Page not found", 
                          title="404 - Page Not Found",
                          now=datetime.now(),
                          skills=skills,
                          projects=projects,
                          technologies=technologies,
                          get_unique_categories=get_unique_categories,
                          get_unique_technologies=get_unique_technologies,
                          truncate_text=truncate_text), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors."""
    technologies = get_unique_technologies(projects)
    
    return render_template('index_projects.html', 
                          error="Internal server error", 
                          title="500 - Server Error",
                          now=datetime.now(),
                          skills=skills,
                          projects=projects,
                          technologies=technologies,
                          get_unique_categories=get_unique_categories,
                          get_unique_technologies=get_unique_technologies,
                          truncate_text=truncate_text), 500
