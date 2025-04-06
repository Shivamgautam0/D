from rest_framework import serializers
from .models import Project, Road

class ProjectSerializer(serializers.ModelSerializer):
    total_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'project_id', 'status', 'error_type', 
                 'issues', 'testing_start_date', 'testing_completion_date',
                 'processing_completed_date', 'total_time']

    def get_total_time(self, obj):
        return str(obj.total_time)

class RoadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Road
        fields = ['id', 'name', 'road_id', 'road_type', 'testing_status',
                 'rsa_status', 'xls_status', 'testing_issues', 'rsa_issues',
                 'xls_issues', 'tester_assigned']

class ProjectDetailSerializer(serializers.ModelSerializer):
    roads = RoadSerializer(many=True, read_only=True)
    total_time = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'project_id', 'processing_completed_date', 'status',
            'error_type', 'issues', 'testing_start_date', 'testing_completion_date',
            'total_time', 'roads'
        ]