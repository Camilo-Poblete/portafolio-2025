"""
Views for the portfolio application.
"""
import os
from PyPDF2 import PdfReader
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect, FileResponse, HttpResponseNotFound

from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.utils.translation import gettext as _
from django.utils import translation
from django.utils.translation import get_language

import fitz  # PyMuPDF
from deep_translator import GoogleTranslator
from reportlab.lib.pagesizes import letter  # Importación necesaria para letter
from reportlab.pdfgen import canvas
from io import BytesIO

from django.core.mail import send_mail
from .models import (
    get_projects,
    get_skills_by_category,
    get_soft_skills,
    get_experience,
    get_education,
    get_certifications
)
from .utils import (
    validate_email_address,
    get_unique_categories,
    get_unique_technologies,
    get_tech_categories,
    get_technologies_by_category,
    truncate_text,
    get_common_context
)
from .forms import ContactForm




def download_cv_es(request):
    # Ruta al archivo CV en español dentro de la carpeta 'media/docs'
    cv_path = os.path.join(settings.MEDIA_ROOT, 'docs', 'CV Camilo Poblete 2025.pdf')

    if os.path.exists(cv_path):
        return FileResponse(open(cv_path, 'rb'), as_attachment=True, filename='CV Camilo Poblete 2025.pdf')
    else:
        return HttpResponseNotFound('El archivo no se encuentra.')

def download_cv_en(request):
    # Ruta al archivo CV en inglés dentro de la carpeta 'media/docs'
    cv_path = os.path.join(settings.MEDIA_ROOT, 'docs', 'CV Camilo Poblete 2025 (ENG).pdf')

    if os.path.exists(cv_path):
        return FileResponse(open(cv_path, 'rb'), as_attachment=True, filename='CV Camilo Poblete 2025 (ENG).pdf')
    else:
        return HttpResponseNotFound('El archivo no se encuentra.')




def index(request):
    """Render the home page."""
    projects = get_projects()
    for project in projects:
        if 'Blockchain' in project['categories']:
            project['color'] = '#8A2BE2'
        elif 'Desarrollo Web' in project['categories']:
            project['color'] = '#00BFFF'
        elif 'Desarrollo Móvil' in project['categories'] or 'Fintech' in project['categories']:
            project['color'] = '#00FFB7'
        elif 'Inteligencia Artificial' in project['categories'] or 'APIs' in project['categories']:
            project['color'] = '#FF3E96'
        elif 'Educación' in project['categories']:
            project['color'] = '#FFD700'
        elif 'Herramientas' in project['categories']:
            project['color'] = '#FF8C00'
        elif 'E-commerce' in project['categories']:
            project['color'] = '#1E90FF'
        elif 'Web3' in project['categories']:
            project['color'] = '#9400D3'
        else:
            project['color'] = '#00FFAA'
    
    context = {
        'active_page': 'home',
        'projects': projects[:6] if len(projects) > 6 else projects,
        'categories': get_unique_categories(projects),
        'technologies': get_unique_technologies(projects),
        'tech_categories': get_tech_categories(projects),
        'technologies_by_category': get_technologies_by_category(projects),
        'skills_by_category': get_skills_by_category(),
        'experience': get_experience(),
        **get_common_context()
    }
    return render(request, 'index.html', context)



def project_list(request):
    projects = get_projects()
    
    # Obtener parámetros de filtro
    selected_category = request.GET.get('category', None)
    selected_tech_category = request.GET.get('tech_category', None)
    selected_technology = request.GET.get('technology', None)
    
    filtered_projects = projects
    
    # Filtrar por categoría de proyecto si está especificada
    if selected_category and selected_category != 'Todas':
        filtered_projects = [p for p in filtered_projects if selected_category in p['categories']]
    
    # Filtrar por categoría de tecnología si está especificada
    if selected_tech_category and selected_tech_category != 'Todas':
        filtered_projects = [p for p in filtered_projects 
                            if selected_tech_category in p['tech_categories']]
    
    # Filtrar por tecnología específica si está especificada
    if selected_technology and selected_technology != 'Todas':
        filtered_projects = [p for p in filtered_projects 
                            if selected_technology in p['technologies']]
    
    # Obtener categorías de tecnologías y tecnologías organizadas
    tech_categories = get_tech_categories(projects)
    technologies_by_category = get_technologies_by_category(projects)
    
    # Filtrar solo las tecnologías de la categoría seleccionada
    selected_technologies = technologies_by_category.get(selected_tech_category, []) if selected_tech_category else []

    context = {
        'active_page': 'projects',
        'title': 'Proyectos',
        'projects': filtered_projects,
        'categories': get_unique_categories(projects),
        'technologies': get_unique_technologies(projects),
        'tech_categories': tech_categories,
        'technologies_by_category': technologies_by_category,
        'selected_tech_category': selected_tech_category,
        'selected_technology': selected_technology,
        'selected_technologies': selected_technologies,  # Pasar las tecnologías filtradas
        **get_common_context()
    }
    
    return render(request, 'projects.html', context)

def project_by_category(request, category):
    all_projects = get_projects()
    filtered_projects = [p for p in all_projects if category in p['categories']]
    
    context = {
        'active_page': 'projects',
        'title': f"{_('Proyectos')} - {category}",
        'projects': filtered_projects,
        'categories': get_unique_categories(all_projects),
        'technologies': get_unique_technologies(all_projects),
        'current_filter': category,
        'filter_type': 'category',
        **get_common_context()
    }
    return render(request, 'projects.html', context)

def skill_list(request):
    context = {
        'active_page': 'skills',
        'title': _('Habilidades'),
        'skills_by_category': get_skills_by_category(),
        'soft_skills': get_soft_skills(),
        **get_common_context()
    }
    return render(request, 'skills.html', context)

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']

            send_mail(
                f'{subject} - {name} ({email})',
                message,
                email,
                [settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            messages.success(request, '¡Tu mensaje ha sido enviado correctamente!')
            return redirect('portfolio:contact')  # Redirige a la misma página
    else:
        form = ContactForm()
    return render(request, 'contact.html', {'form': form})



@require_http_methods(["GET"])
def api_projects(request):
    projects = get_projects()
    category = request.GET.get('category')
    technology = request.GET.get('technology')
    
    if category:
        projects = [p for p in projects if category in p['categories']]
    if technology:
        projects = [p for p in projects if technology in p['technologies']]
    
    return JsonResponse({'projects': projects})

def change_language(request, language_code):
    next_url = request.META.get('HTTP_REFERER', '/')
    if language_code in ['en', 'es']:
        translation.activate(language_code)
        request.session['_language'] = language_code
        response = HttpResponseRedirect(next_url)
        response.set_cookie(
            settings.LANGUAGE_COOKIE_NAME,
            language_code,
            max_age=365*24*60*60,
            httponly=True,
            path='/',
        )
        return response
    return redirect(next_url)

def about(request):
    context = {
        'active_page': 'about',
        'title': _('Sobre Mí'),
        'education': get_education(),
        'certifications': get_certifications(),
        **get_common_context()
    }
    return render(request, 'about.html', context)

def all_projects(request):
    projects = get_projects()
    context = {
        'active_page': 'projects',
        'title': _('Todos los Proyectos'),
        'projects': projects,
        'categories': get_unique_categories(projects),
        'technologies': get_unique_technologies(projects),
        'layout': 'grid',
        **get_common_context()
    }
    return render(request, 'all_projects.html', context)

def handler404(request, exception):
    context = {
        'title': _('Página no encontrada'),
        **get_common_context()
    }
    return render(request, '404.html', context, status=404)

def handler500(request):
    context = {
        'title': _('Error del servidor'),
        **get_common_context()
    }
    return render(request, '500.html', context, status=500)
