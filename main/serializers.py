from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Message , Chat



class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')
        
        
        
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ('url', 'text', 'author','chat', 'created_at', 'updated_at')
    
    def validate_chat(self, value):
        if(not value.users.filter(id=self.context.get('request').user.id).exists()):
            raise serializers.ValidationError("You are not a member of this chat")
        return value
        
        
class ChatSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Chat
        fields = ('url', 'name', 'users','admins', 'messages')
        
        
    #To avoid heavy list lookups list views don't return messages attached to chat    
    def __init__(self, *args, **kwargs):
        super().__init__( *args, **kwargs)
        if (self.context.get('request').parser_context['kwargs'].get('pk') == None):
            self.fields.pop('messages')
            
    
        