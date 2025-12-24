from django.contrib import admin

from .models import PortfolioItem, Review


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('created_at',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'created_at')
    search_fields = ('name', 'title', 'text')
    list_filter = ('created_at',)
