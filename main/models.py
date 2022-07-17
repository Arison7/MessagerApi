from hashlib import blake2b
from importlib.metadata import requires
from django.db import models


# Create your models here.


class Message (models.Model):
    text = models.TextField()
    author = models.ForeignKey('auth.User', related_name='messages', on_delete=models.CASCADE, blank=True , null=True)
    chat = models.ForeignKey('Chat', related_name='messages', on_delete=models.CASCADE )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text
    
class Chat (models.Model):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField('auth.User', related_name='chats', blank=True)
    admins = models.ManyToManyField('auth.User', related_name='administrated_chats', blank= True)
    
    def __str__(self):
        return self.name
"""
class Connection(models.Model):
    user : int = models.ForeignKey('auth.User', related_name='connections', on_delete=models.CASCADE)
    ping : bool = models.BooleanField(default=False) 
    
    def __str__(self):
        return str(self.pk)
"""
