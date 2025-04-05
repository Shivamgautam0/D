from django.contrib import admin
from .models import Project, Road

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'project_id', 'status', 'processing_completed_date', 'testing_start_date')
    list_filter = ('status', 'error_type')
    search_fields = ('name', 'project_id')

@admin.register(Road)
class RoadAdmin(admin.ModelAdmin):
    list_display = ('name', 'road_id', 'road_type', 'project', 'testing_status', 'rsa_status', 'xls_status')
    list_filter = ('road_type', 'testing_status', 'rsa_status', 'xls_status')
    search_fields = ('name', 'road_id')