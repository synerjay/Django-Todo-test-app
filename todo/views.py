from django.shortcuts import render
from rest_framework import viewsets # provides the implementation for CRUD operations
from .serializers import TodoSerializer # import serializer
from .models import Todo # import in Todo

# Static Files MIME Type Issue datte
from django.views import View
from django.http import HttpResponse, HttpResponseNotFound
import os

# Create your views here.

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

# Add this CBV
class Assets(View):

    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'static', filename)

        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read(), content_type='application/javascript')
        else:
            return HttpResponseNotFound()
