from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns  # ⬅️ Importar esto

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portfolio_app.urls')),
    
    # ⬇️ Esta línea permite el cambio de idioma (set_language)
    path('i18n/', include('django.conf.urls.i18n')),
]

# Archivos estáticos y media en modo DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
