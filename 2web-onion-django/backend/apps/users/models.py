from django.db import models

class User(models.Model):
    """User model - Django expects models here"""
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        # app_label = 'users' 
        ordering = ['-created_at']
    
    def __str__(self):
        return self.username