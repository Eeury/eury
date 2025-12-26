from django.db import models
from cloudinary.models import CloudinaryField

class PortfolioItem(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    image = CloudinaryField(
        'image',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Review(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=150)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.title}"
