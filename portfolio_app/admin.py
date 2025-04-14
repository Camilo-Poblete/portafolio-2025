from django.contrib import admin
from .models import Certificacion

@admin.register(Certificacion)
class CertificacionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'organizacion', 'fecha_obtencion', 'fecha_expiracion', 'url_verificacion')
    search_fields = ('titulo', 'organizacion')
    list_filter = ('fecha_obtencion', 'fecha_expiracion')
