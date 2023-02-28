from django import views
from rest_framework import permissions
from .models import Chat


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions will be only allowed if the user 
        # is in the chat of the message
        if request.method in permissions.SAFE_METHODS and obj.chat.users.filter(id=request.user.id).exists():
            return True

        # Instance must have an attribute named `author`.
        return obj.author == request.user or request.user.is_staff

class ChatPermissions(permissions.BasePermission):
    def has_permission(self, request, view, *args, **kwargs):
       
        #if the request is done for a detail view we need to check extra premissions  
        pk = request.parser_context['kwargs'].get('pk')
        if(pk != None):
            obj = Chat.objects.get(pk = pk)
            return self.has_object_permission(request,view,obj)
        #otherwise the permissions are handled by the queryset
        return True
    
    def has_object_permission(self, request,view, obj ):
        user = request.user
        #everyone can create a chat and everyone can join a chat
        #Pacth is used only for user to quit a chat or join a chat so it's allowed for everyone
        if(user.is_staff or request.method == "POST" or request.method == "PATCH" or view.action == "join_chat"):
            return True
        if(len(obj.users.get_queryset().filter(pk = request.user.id)) != 0):
            #Safe methods are allowed for every member of a chat
            if(request.method in permissions.SAFE_METHODS):
               return True
        #Delete is never allowed for anyone channel will delete itself when there are no users
        return False
    