from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Message , Chat
from rest_framework.reverse import reverse



class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')
        
class UserPublicSerializer(serializers.Serializer):
    username = serializers.CharField(read_only=True)
    url = serializers.HyperlinkedIdentityField(view_name='user-detail')
    
        
        
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    author_name = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = Message
        fields = ('url', 'text', 'author','author_name','chat', 'created_at', 'updated_at')
    
    def validate_chat(self, value):
        if(not value.users.filter(id=self.context.get('request').user.id).exists()):
            raise serializers.ValidationError("You are not a member of this chat")
        return value
    def get_author_name(self,obj):
        return obj.author.username
        
        
class ChatSerializer(serializers.HyperlinkedModelSerializer):
    inviteLink  = serializers.SerializerMethodField(read_only = True)
    users = UserPublicSerializer(many=True, read_only=True) 
    class Meta:
        model = Chat
        fields = ('url', 'name', 'users', 'inviteLink' ,'messages'  )
        
    def get_inviteLink(self,obj):
        result =  reverse('chat-detail', kwargs={'pk':obj.id}, request=self.context.get('request'))  
        return result + '{}/'.format(obj.inviteHash)
        
        
    #To avoid heavy list lookups list views don't return messages attached to chat    
    def __init__(self, *args, **kwargs):
        super().__init__( *args, **kwargs)
        if (self.context.get('request').parser_context['kwargs'].get('pk') == None):
            self.fields.pop('messages')
        
        
            
            
            
    
        