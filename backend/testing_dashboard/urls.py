from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, RoadViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'roads', RoadViewSet)

urlpatterns = [
    path('', include(router.urls)),
]