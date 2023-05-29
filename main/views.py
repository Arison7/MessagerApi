from urllib.parse import urlencode

from django.conf import settings
from django.contrib.auth.models import Group, User
from django.contrib.auth.views import RedirectURLMixin, LoginView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login as auth_login
from django.http import HttpResponseRedirect
from django.shortcuts import render, resolve_url
from django.views.generic.edit import FormView
from rest_framework import viewsets , status
from rest_framework.decorators import action
from rest_framework.response import Response
from main.serializers import (ChatSerializer, GroupSerializer,
                              MessageSerializer, UserSerializer)

from .models import Chat, Message
from .permissions import ChatPermissions, IsOwnerOrReadOnly



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
        print('hi')
        pk = self.request.parser_context['kwargs'].get('pk')
        user = self.request.user
        lookup_data = {}
        lookup_data['author'] = user
        qs = super().get_queryset()
        if(user.is_staff or pk != None ):
            return qs
        return qs.filter(**lookup_data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        #?data is passed so it can be later sent to the clients via websocket for deletion
        data = self.get_serializer(instance).data
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK, data=data)
        
    
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
        serializer.save(users = [self.request.user])
    
    #used only for users leaving or joing the channel 
    def update(self, request, *args, **kwargs):
        #print url a request
        instance = self.get_object()
        action = request.data.get('action', None)
        status_code = status.HTTP_400_BAD_REQUEST
        if(action == 'quit'):
            status_code = instance.quit_or_delete(self.request.user)
        elif(action == 'join'):
            if(not instance.users.filter(id = self.request.user.id).exists()):
                instance.users.add(self.request.user)
            status_code = status.HTTP_200_OK
        return Response(status=status_code)
    
   
    @action(detail=True, url_path="messages")
    def paginated_messages(self,request,pk=None,*args,**kwargs):
        """
        ?View endpoint to get paginated messages for a chat
        
        Should return paginated and serialized data for a chat 
        based on object permissions
        """
        
        instance = self.get_object()
        qs = instance.messages.get_queryset()
        page = self.paginate_queryset(qs.order_by('-created_at'))
        if page is not None:
            serializer = MessageSerializer(page, many=True, context= {'request':self.request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
    
    #match any string in the url that was exactly 22 characters long
    @action(detail=True, url_path="(?P<_hash>[^/.]{22})", url_name="join_chat")
    def join_chat(self,request,_hash=None, pk = None,*args,**kwargs):
        
        #if user isn't logged in redirect to login page with invite link 
        if(not request.user.is_authenticated):
            params = urlencode({'inviteLink': _hash, 'pk': pk}) 
            return HttpResponseRedirect('/login/?' + params)
        
         
        instance = Chat.objects.get(id = pk)
        if(instance.inviteHash == _hash):
            #?if the user is already in the chat
            if(not instance.users.filter(id = self.request.user.id).exists()):
                instance.users.add(self.request.user)
                
        return HttpResponseRedirect("/")

    
class RegisterView(RedirectURLMixin, FormView):
    """
    View for registering a new user 
    """
    
    form_class =  UserCreationForm
    template_name = 'registration/register.html'
    
    
    def form_valid(self, form):
        print("valid")
        form.save()
        return HttpResponseRedirect(resolve_url(settings.LOGIN_REDIRECT_URL))
        
    def form_invalid(self, form):
        print('invalid')
        return super().form_invalid(form)   
    
class MyLoginView(LoginView):
    """
    lightly modified login view
    """
        
    def form_valid(self, form):
        """
        Security check complete. Log the user in.
        """
        auth_login(self.request, form.get_user())
        
        #get thhe url paremeters  
        pk = self.request.POST.get('pk', None)
        invite = self.request.POST.get('inviteLink', None)
       
        #if the paremeters are present user will be redirected throught joining chat view 
        if(pk not in [None,''] and invite not in [None, '']):
            return HttpResponseRedirect('/endpoints/chats' + '/' + pk + '/' + invite + '/')
        
        return HttpResponseRedirect(self.get_success_url())


def mainWindowView(request):
    if(not request.user.is_authenticated):
        return HttpResponseRedirect('/login/')
    return render(request, 'index.html')
    
    