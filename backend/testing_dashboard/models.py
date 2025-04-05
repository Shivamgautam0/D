from django.db import models
from django.utils import timezone

class Project(models.Model):
    PROJECT_STATUS_CHOICES = [
        ('TESTING', 'Under Testing'),
        ('COMPLETED', 'Testing Completed'),
        ('FAILED', 'Testing Failed'),
    ]
    
    ERROR_TYPE_CHOICES = [
        ('PROCESSING', 'Processing Error'),
        ('TESTING', 'Testing Error'),
        ('NONE', 'No Error'),
    ]
    
    name = models.CharField(max_length=255)
    project_id = models.CharField(max_length=100, unique=True)
    processing_completed_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=PROJECT_STATUS_CHOICES, default='TESTING')
    error_type = models.CharField(max_length=20, choices=ERROR_TYPE_CHOICES, default='NONE')
    issues = models.TextField(blank=True, null=True)
    testing_start_date = models.DateTimeField(auto_now_add=True)
    testing_completion_date = models.DateTimeField(null=True, blank=True)
    
    @property
    def total_time(self):
        end_time = self.testing_completion_date if self.testing_completion_date else timezone.now()
        return end_time - self.testing_start_date
    
    def __str__(self):
        return f"{self.name} ({self.project_id})"

class Road(models.Model):
    ROAD_TYPE_CHOICES = [
        ('MCW_LHS', 'MCW LHS'),
        ('MCW_RHS', 'MCW RHS'),
        ('SLL', 'SLL'),
        ('SRR', 'SRR'),
        ('IRR', 'IRR'),
        ('IRL', 'IRL'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='roads')
    name = models.CharField(max_length=255)
    road_id = models.CharField(max_length=100)
    road_type = models.CharField(max_length=10, choices=ROAD_TYPE_CHOICES)
    testing_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    rsa_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    xls_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    tester_assigned = models.CharField(max_length=100, blank=True, null=True)
    testing_issues = models.TextField(blank=True, null=True)
    rsa_issues = models.TextField(blank=True, null=True)
    xls_issues = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['road_type', 'name']
        
    def __str__(self):
        return f"{self.name} ({self.road_type})"