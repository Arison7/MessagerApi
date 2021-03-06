from django import views
from rest_framework import permissions
from .models import Chat


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `author`.
        return obj.author == request.user or request.user.is_staff

class ChatPermissions(permissions.BasePermission):
    def has_permission(self, request, view, *args, **kwargs):
        
        #This action should be considered as a object base action
        if(view.action in ["eventSource","messages"]) :
            pk = request.parser_context['kwargs'].get('pk')
            obj = Chat.objects.get(pk = pk)
            return self.has_object_permission(request,view,obj)
        return True
    
    def has_object_permission(self, request, view, obj ):
        user = request.user
        #everyone can create a chat
        #Pacth is used only for user to quit a chat or join a chat so it's allowed for everyone
        if(user.is_staff or request.method == "POST" or request.method == "PATCH"):
            return True
        if(len(obj.users.get_queryset().filter(pk = request.user.id)) != 0):
            #Safe methods are allowed for every member of a chat
            if(request.method in permissions.SAFE_METHODS):
               return True
        #Delete is never allowed for anyone channel will delete itself when there are no users
        return False
    