from multiprocessing.context import _force_start_method
from django.test import TestCase
from django.contrib.auth.models import User
from requests import request
from .models import Message, Chat
from .views import MessageViewSet, ChatViewSet
from .serializers import MessageSerializer, ChatSerializer
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient


class MessageTestCase(TestCase):   
    def setUp(self):
        user = User.objects.create(username='user1')
        User.objects.create(username='user2')
        chat = Chat.objects.create(name='chat1')
        chat.users.add(user)
        
    def test_correct_message_creation(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        respond = client.post("http://testserver/endpoints/messages/",
                                   {'message': 'test message',
                                    'chat':"http://testserver/endpoints/chats/1/" })
        self.assertEqual(respond.status_code, 200)
    """
    User can't create message in chat that he doesn't belong to
    """
    def test_incorrect_messege_creation(self):
        client = APIClient()
        user = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        respond = client.post("http://testserver/endpoints/messages/",
                                   {'message': 'test message',
                                    'chat':"http://testserver/endpoints/chats/1/" })
        self.assertEqual(respond.status_code, 400)
    

        