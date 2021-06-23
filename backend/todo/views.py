from django.shortcuts import render
from rest_framework import viewsets # provides the implementation for CRUD operations
from .serializers import TodoSerializer # import serializer
from .models import Todo # import in Todo

# Create your views here.

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
