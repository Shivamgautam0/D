from django.core.management.base import BaseCommand
from testing_dashboard.models import Project, Road
from django.utils import timezone
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Populates the database with sample testing data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database population...')
        
        # Clear existing data
        Project.objects.all().delete()
        
        # Sample data
        project_statuses = ['TESTING', 'COMPLETED', 'FAILED']
        error_types = ['PROCESSING', 'TESTING', 'NONE']
        road_statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']
        road_types = ['MCW_LHS', 'MCW_RHS', 'SLL', 'SRR', 'IRR', 'IRL']
        
        # Create 30 sample projects
        for i in range(30):
            # Generate random dates
            testing_start_date = timezone.now() - timedelta(days=random.randint(1, 60))
            processing_completed_date = testing_start_date + timedelta(hours=random.randint(1, 24))
            
            status = random.choices(project_statuses, weights=[0.3, 0.5, 0.2])[0]
            
            project = Project.objects.create(
                name=f"Test Project {i+1}",
                project_id=f"TP{2023+random.randint(0,1)}-{random.randint(1000, 9999)}",
                processing_completed_date=processing_completed_date,
                status=status,
                error_type='NONE',
                testing_start_date=testing_start_date
            )
            
            if status == 'COMPLETED':
                project.testing_completion_date = processing_completed_date + timedelta(days=random.randint(1, 10))
                project.save()
            elif status == 'FAILED':
                project.error_type = random.choice(['PROCESSING', 'TESTING'])
                project.issues = f"Sample error description for {project.error_type.lower()} error"
                project.testing_completion_date = processing_completed_date + timedelta(days=random.randint(1, 5))
                project.save()
            
            # Create roads for each project
            for road_type in road_types:
                road_status = random.choice(road_statuses)
                
                road = Road.objects.create(
                    project=project,
                    name=f"{road_type} Road {i+1}",
                    road_id=f"RD{random.randint(1000, 9999)}",
                    road_type=road_type,
                    testing_status=road_status,
                    rsa_status=random.choice(road_statuses),
                    xls_status=random.choice(road_statuses),
                    tester_assigned=f"Tester {random.randint(1, 5)}"
                )
                
                if road_status in ['COMPLETED', 'FAILED']:
                    if road_status == 'FAILED':
                        road.testing_issues = "Sample testing issues\nIssue 1\nIssue 2"
                        road.rsa_issues = "Sample RSA issues\nIssue 1\nIssue 2"
                        road.xls_issues = "Sample XLS issues\nIssue 1\nIssue 2"
                        road.save()
                
                self.stdout.write(f'Created road: {road.name} for project: {project.name}')
            
            self.stdout.write(self.style.SUCCESS(f'Created project: {project.name}'))
        
        self.stdout.write(self.style.SUCCESS('Database population completed successfully!')) 