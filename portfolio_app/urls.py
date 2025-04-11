from django.urls import path
from . import views

from django.views.generic import TemplateView

app_name = 'portfolio'

urlpatterns = [
    path('', views.index, name='index'),
    path('projects/', views.project_list, name='project_list'),
    path('projects/category/<str:category>/', views.project_by_category, name='project_by_category'),
    path('skills/', views.skill_list, name='skill_list'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    path('all-projects/', views.all_projects, name='all_projects'),
    path('api/projects/', views.api_projects, name='api_projects'),
    path('success/', TemplateView.as_view(template_name='success.html'), name='success'),
       path('download/cv_es/', views.download_cv_es, name='download_cv_es'),
       path('download/cv_en/', views.download_cv_en, name='download_cv_en'),
]
