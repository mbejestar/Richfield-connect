from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def root_status(request):
    return JsonResponse({
        "status": "online",
        "service": "RichfieldConnect Django Database Engine",
        "version": "1.0.0",
        "api_root": "/api/"
    })


urlpatterns = [
    path('', root_status, name='root-status'),
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]
