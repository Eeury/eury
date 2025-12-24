from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/reviews/', views.reviews_api, name='reviews_api'),
]





