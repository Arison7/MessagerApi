from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from main.serializers import UserSerializer, GroupSerializer, MessageSerializer , ChatSerializer
from .models import Message , Chat
from django.http import HttpResponse, HttpResponseRedirect, StreamingHttpResponse
from .permissions import IsOwnerOrReadOnly, ChatPermissions
from rest_framework.decorators import action
from django.dispatch import receiver
from django.db.models.signals import m2m_changed , post_save
from json import dumps as jsonDumps
from django.core.serializers.json import DjangoJSONEncoder
from time import sleep
from .renderers import EventStreamRender

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
    
    
    def event_stream(self,qs,instance):
        #todo: implement signals for updates of oneToMany field
        def messages_changes_signal( *args, **kwargs):
            print(args,kwargs)
            
        post_save.connect(messages_changes_signal, Chat)
        qs = self.filter_queryset(qs())
        page = self.paginate_queryset(qs)
        data = jsonDumps( MessageSerializer(page,many = True, context= {'request':self.request}).data, cls = DjangoJSONEncoder)
        yield f"event: InitialDataLoad\ndata: {data}\n\n"
        #! temperary
        initial_data = ""
        while True:
            if(initial_data != data):
                initial_data = data
            sleep(1)
    
    
    #?view endpoints to open SSE for serving updates to chat.messages to client 
    @action(methods = ["get"], detail=True, renderer_classes = [EventStreamRender])
    def eventSource(self,request,pk=None,*args,**kwargs):
        instance = self.get_object()
        qs = instance.messages.get_queryset
        response = StreamingHttpResponse(self.event_stream(qs,instance))
        #?Standart streaming response aributes
        response['Content-Type'] = "text/event-stream"
        response.status_code = 200
        response.headers["Cache-Control"] = "no-chache"
        return response
    
       







def mainWindowView(request):
    if(not request.user.is_authenticated):
        return HttpResponseRedirect('/api-auth/login/')
    return render(request, 'index.html')
    
    