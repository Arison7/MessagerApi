from http import client
from multiprocessing.context import _force_start_method
from django.test import TestCase
from django.contrib.auth.models import User
from .models import Message, Chat
from rest_framework.test import APIClient


class MessageTestCase(TestCase):   
    def setUp(self):
        user = User.objects.create(username='user1')
        user2 = User.objects.create(username='user2')
        chat = Chat.objects.create(name='chat1')
        chat.users.add(user)
        chat2 = Chat.objects.create(name='chat2')
        chat2.users.add(user)
        chat2.users.add(user2)
        
    def test_correct_message_creation(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        respond = client.post("http://testserver/endpoints/messages/",
                                   {'message': 'test message',
                                    'chat':"http://testserver/endpoints/chats/1/" })
        self.assertEqual(respond.status_code, 201)
    """
    User can't create message in chat that he doesn't belong to
    """
    def test_incorrect_message_creation(self):
        client = APIClient()
        user = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        respond = client.post("http://testserver/endpoints/messages/",
                                   {'message': 'test message',
                                    'chat':"http://testserver/endpoints/chats/1/" })
        self.assertEqual(respond.status_code, 400)
    def test_message_permission_is_author_correct(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        client.post("http://testserver/endpoints/messages/",
                                   {'message': 'permission test message',
                                    'chat':"http://testserver/endpoints/chats/1/" })
        respond = client.delete("http://testserver/endpoints/messages/1/")
        
        self.assertEqual(respond.status_code,204)
        
    def test_message_permission_is_author_incorrect(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        secondUser = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        client.post("http://testserver/endpoints/messages/",
                                   {'message': 'permission test message',
                                    'chat':"http://testserver/endpoints/chats/1/" })
        client.force_authenticate(user=secondUser) 
        respond = client.delete("http://testserver/endpoints/messages/1/")
        
        self.assertEqual(respond.status_code,403)
    def test_message_permission_correct_list(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        secondUser = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        client.post("http://testserver/endpoints/messages/",
                                   {'message': 'permission test message',
                                    'chat':"http://testserver/endpoints/chats/1/" })
        respond = client.get("http://testserver/endpoints/messages/")
        count = respond.data['count']
        
        self.assertEqual(count,1)
    
    def test_message_permission_incorrect_list(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        secondUser = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        client.post("http://testserver/endpoints/messages/",
                                   {'message': 'permission test message',
                                    'chat':"http://testserver/endpoints/chats/1/" })
        client.force_authenticate(user=secondUser) 
        respond = client.get("http://testserver/endpoints/messages/")
        count = respond.data['count']
        
        self.assertEqual(count,0)
    def test_others_user_message_lookup(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        secondUser = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        respond = client.post("http://testserver/endpoints/messages/",
                                   {'message': 'permission test message',
                                    'chat':"http://testserver/endpoints/chats/2/" })
        url = respond.data['url']
        client.force_authenticate(user=secondUser) 
        respond = client.get(url)
        self.assertEqual(respond.status_code,200)
        
        
        
        
        
class ChatTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username='user1')
        User.objects.create(username='user2')
        Chat.objects.create(name='chat2')
        chat = Chat.objects.create(name='chat1')
        chat.users.add(user)
    """
    Chat cannot be created without a name and user creating it should be added to it users list
    """
    def test_correct_chat_creation(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        respond = client.post("http://testserver/endpoints/chats/",
                    {'name': 'test chat'})
        url = respond.data['url']
        self.assertEquals(respond.status_code, 201)
        #chat should contain user1
        respond = client.get(url)
        count = len(respond.data['users'])
        self.assertEqual(count,1)
         
    """
    U can only list chats that u are in
    """ 
        
    def test_correct_chat_list(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        respond = client.get("http://testserver/endpoints/chats/")
        count = respond.data['count']
        self.assertEqual(count,1)
        
    def test_intcorrect_chat_list(self):
        client = APIClient()
        user2 = User.objects.get(username='user2')
        client.force_authenticate(user=user2)
        respond = client.get("http://testserver/endpoints/chats/")
        count = respond.data['count']
        self.assertEqual(count,0)
        
        
        
    
        
    
   
    
    
     

        