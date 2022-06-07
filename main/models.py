from django.db import models


# Create your models here.


class Message (models.Model):
    message = models.TextField()
    owner = models.ForeignKey('auth.User', related_name='messages', on_delete=models.CASCADE, blank=True)
    chat = models.ForeignKey('Chat', related_name='messages', on_delete=models.CASCADE )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.message
    
class Chat (models.Model):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField('auth.User', related_name='chats')
    
    def __str__(self):
        return self.name