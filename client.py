import requests


req = requests.post('http://localhost:8000/endpoint/messages/', 
                    data={'message': 'Hello World',"chat":'http://localhost:8000/endpoint/chats/2/'},
                    auth=('admin', 'messageApi#1'))
print(req.text)