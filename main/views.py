from json import dumps as jsonDumps 
from time import sleep

from django.contrib.auth.models import Group, User
from django.db.models.signals import post_delete, post_save
from django.http import HttpResponse, HttpResponseRedirect, StreamingHttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from main.serializers import (ChatSerializer, GroupSerializer,
                              MessageSerializer, UserSerializer)

from .models import Chat, Message
from .permissions import ChatPermissions, IsOwnerOrReadOnly
from typing import List , Any , Tuple


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        return qs.filter(id = user.id) 


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    
class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Message.objects.all().order_by('-created_at')
    serializer_class = MessageSerializer
    permission_classes = [IsOwnerOrReadOnly]
    
        
    def perform_create(self, serializer):
        serializer.save(author=self.request.user) 

    def get_queryset(self):
        pk = self.request.parser_context['kwargs'].get('pk')
        user = self.request.user
        lookup_data = {}
        lookup_data['author'] = user
        qs = super().get_queryset()
        if(user.is_staff or pk != None ):
            return qs
        return qs.filter(**lookup_data)

        
    
class ChatViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows chats to be viewed or edited.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [ChatPermissions]
    
    
    
    def get_queryset(self):
        user = self.request.user
        chats = User.objects.get(id = user.id).chats.all()
        if(user.is_staff):
            return super().get_queryset().order_by('name')
        return chats.order_by('name')
     
    def perform_create(self, serializer):
        serializer.save(users = [self.request.user],admins = [self.request.user])
    
    """ 
    @action(methods = ["get"], detail=True, renderer_classes = [EventStreamRender])
    def eventSource(self,request,**kwargs):
        ?view endpoints to open SSE for serving updates to chat.messages to client 
        ?GET method is used to open SSE connection
        ?POST method is used for heartbeat pinging
        instance = self.get_object()
        response = StreamingHttpResponse(self.event_stream(request,instance))
        #?Standart streaming response aributes
        response['Content-Type'] = "text/event-stream"
        response.status_code = 200
        response.headers["Cache-Control"] = "no-chache"
        return response
    """
   
    @action( detail=True, url_path="messages")
    def paginated_messages(self,request,pk=None,*args,**kwargs):
        """
        ?View endpoint to get paginated messages for a chat
        
        Should return paginated and serialized data for a chat 
        basaed on object permissions
        """
        
        instance = self.get_object()
        qs = instance.messages.get_queryset()
        page = self.paginate_queryset(qs.order_by('-created_at'))
        if page is not None:
            serializer = MessageSerializer(page, many=True, context= {'request':self.request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    
       





def mainWindowView(request):
    if(not request.user.is_authenticated):
        return HttpResponseRedirect('/api-auth/login/')
    return render(request, 'index.html')
    
    