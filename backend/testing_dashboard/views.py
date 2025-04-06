from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Project, Road
from .serializers import ProjectSerializer, RoadSerializer, ProjectDetailSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'error_type']
    search_fields = ['name', 'project_id']
    ordering_fields = ['name', 'processing_completed_date', 'testing_start_date', 'testing_completion_date']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer
    
    def list(self, request):
        projects = {
            'nhai': [],
            'rsa': [],
            'xls': []
        }
        
        all_projects = self.get_queryset()
        for project in all_projects:
            if project.status == 'TESTING':
                category = 'nhai'
            elif project.status == 'COMPLETED':
                category = 'rsa'
            else:
                category = 'xls'
            
            projects[category].append(self.get_serializer(project).data)
        
        return Response(projects)
    
    @action(detail=True, methods=['get'])
    def roads(self, request, pk=None):
        project = self.get_object()
        roads = Road.objects.filter(project=project).order_by('road_type')
        return Response({
            'project': self.get_serializer(project).data,
            'roads': RoadSerializer(roads, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def testing(self, request):
        projects = self.queryset.filter(status='TESTING')
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        projects = self.queryset.filter(status='COMPLETED')
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def failed(self, request):
        projects = self.queryset.filter(status='FAILED')
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

class RoadViewSet(viewsets.ModelViewSet):
    queryset = Road.objects.all()
    serializer_class = RoadSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'road_type', 'testing_status', 'rsa_status', 'xls_status']
    search_fields = ['name', 'road_id']
    ordering_fields = ['road_type', 'name']
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        project_id = request.query_params.get('project_id')
        if not project_id:
            return Response({"error": "Project ID is required"}, status=400)
            
        roads = self.queryset.filter(project_id=project_id).order_by('road_type')
        serializer = self.get_serializer(roads, many=True)
        return Response(serializer.data)