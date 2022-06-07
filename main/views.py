from math import perm
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from main.serializers import UserSerializer, GroupSerializer, MessageSerializer , ChatSerializer
from .models import Message , Chat
from django.http import HttpResponseRedirect, HttpResponse
from rest_framework.response import Response
from .permissions import IsOwnerOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Message.objects.all().order_by('-created_at')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated ,IsOwnerOrReadOnly]
    
        
    def create(self,request):
        instance = self.serializer_class(data=request.data, context = {'request': request}) 
        if(instance.is_valid()):
            chat = instance.validated_data['chat']
            if(chat.users.filter(id=request.user.id).exists()):
                instance.save()
                return Response(instance.data)
        return Response(status=400)
    
    
class ChatViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows chats to be viewed or edited.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]





def mainWindowView(request):
    if(not request.user.is_authenticated):
        return HttpResponseRedirect('/api-auth/login/')
    return render(request, 'main/mainWindow.html')
    
    