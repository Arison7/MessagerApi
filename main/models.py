from django.db import models
from rest_framework import status
from secrets import token_urlsafe


# Create your models here.


class Message (models.Model):
    text = models.TextField()
    author = models.ForeignKey('auth.User', related_name='messages', on_delete=models.CASCADE, blank=True , null=True)
    chat = models.ForeignKey('Chat', related_name='messages', on_delete=models.CASCADE )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text

def generate_hash():
    return token_urlsafe(16) 
class Chat (models.Model):
    name = models.CharField(max_length=24)
    users = models.ManyToManyField('auth.User', related_name='chats', blank=True)
    inviteHash = models.CharField(max_length=22 ,unique=True , default= generate_hash  )  
    
    def __str__(self):
        return self.name
    
    #returns a status code for a view
    def quit_or_delete(self, user) -> status:
        if(self.users.filter(id=user.id).exists()):
            self.users.remove(user)
            if(self.users.count() == 0):
                self.delete()
            return status.HTTP_200_OK
        return status.HTTP_404_NOT_FOUND
    
        
    
       
     
        
        
