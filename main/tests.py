from django.test import TestCase
from django.contrib.auth.models import User
from .models import Chat
from rest_framework.test import APIClient



class MessageTestCase(TestCase):   
    def __init__(self, methodName: str = ...) -> None:
        self.urlMessages = "http://testserver/endpoints/messages/"
        self.urlFirstChat =  "http://testserver/endpoints/chats/1/"
        super().__init__(methodName)
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
        respond = client.post(self.urlMessages,
                                   {'text': 'test message',
                                    'chat':self.urlFirstChat })
        self.assertEqual(respond.status_code, 201)
    """
    User can't create message in chat that he doesn't belong to
    """
    def test_incorrect_message_creation(self):
        client = APIClient()
        user = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        respond = client.post(self.urlMessages,
                                   {'text': 'test message',
                                    'chat':self.urlFirstChat })
        self.assertEqual(respond.status_code, 400)
        
    def test_message_permission_is_author_correct(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        client.post(self.urlMessages,
                                   {'text': 'permission test message',
                                    'chat':self.urlFirstChat })
        respond = client.delete(self.urlMessages+"1/")
        
        self.assertEqual(respond.status_code,200)
        
    def test_message_permission_is_author_incorrect(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        secondUser = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        client.post(self.urlMessages,
                                   {'text': 'permission test message',
                                    'chat':self.urlFirstChat })
        client.force_authenticate(user=secondUser) 
        respond = client.delete(self.urlMessages+"1/")
        
        self.assertEqual(respond.status_code,403)
    def test_message_permission_correct_list(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        client.post(self.urlMessages,
                                   {'text': 'permission test message',
                                    'chat':self.urlFirstChat })
        respond = client.get(self.urlMessages)
        count = respond.data['count']
        
        self.assertEqual(count,1)
    
    def test_message_permission_incorrect_list(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        secondUser = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        client.post(self.urlMessages,
                                   {'text': 'permission test message',
                                    'chat':self.urlFirstChat })
        client.force_authenticate(user=secondUser) 
        respond = client.get(self.urlMessages)
        count = respond.data['count']
        
        self.assertEqual(count,0)
    def test_others_user_message_lookup(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        secondUser = User.objects.get(username='user2')
        client.force_authenticate(user=user)
        respond = client.post(self.urlMessages,
                                   {'text': 'permission test message',
                                    'chat': self.urlFirstChat.replace("1","2") })
        url = respond.data['url']
        client.force_authenticate(user=secondUser) 
        respond = client.get(url)
        self.assertEqual(respond.status_code,200)
        
        
        
        
        
class ChatTestCase(TestCase):
    def __init__(self, methodName: str = ...) -> None:
        self.urlChats = "http://testserver/endpoints/chats/"
        self.urlEvent = "http://testserver/endpoints/chats/1/eventSource/"
        super().__init__(methodName)
    def setUp(self):
        user = User.objects.create(username='user1')
        User.objects.create(username='user2')
        chat = Chat.objects.create(name='chat1')
        Chat.objects.create(name='chat2')
        chat.users.add(user)
    """
    Chat cannot be created without a name and user creating it should be added to it users list
    """
    def test_correct_chat_creation(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        respond = client.post(self.urlChats,
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
        respond = client.get(self.urlChats)
        count = respond.data['count']
        self.assertEqual(count,1)
        
    def test_incorrect_chat_list(self):
        client = APIClient()
        user2 = User.objects.get(username='user2')
        client.force_authenticate(user=user2)
        respond = client.get(self.urlChats)
        count = respond.data['count']
        self.assertEqual(count,0)
        
    def test_chat_user_quit(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user=user)
        data = {'action':'quit'}
        respond = client.patch(self.urlChats+"1/",data)
        self.assertEqual(respond.status_code,200)
        respond = client.get(self.urlChats+"1/")
        self.assertEqual(respond.status_code,404)
        
        
    
        
        
        
    
     
        

class UserModelTestCase(TestCase):
    
    def setUp(self):
        User.objects.create(username='user1')
        User.objects.create(username='user2')
        User.objects.create_superuser(username='user3')
    
    def test_user_list_only_themself(self):
        client = APIClient()
        user = User.objects.get(username='user1')
        client.force_authenticate(user= user)
        respond = client.get("http://testserver/endpoints/users/")
        self.assertEqual(respond.data['count'],1)
        
        
        
    
        
    
   
    
    
     

        