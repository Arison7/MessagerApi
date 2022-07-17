from email.policy import default
import json 
from channels.generic.websocket import AsyncWebsocketConsumer



#todo: recive messsage posted by a user and send serialized version of it from db to all users
class chatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pk : int = self.scope["url_route"].get("kwargs").get('pk', None)
        if(pk is None):
            self.disconnect(code="404")
        self.chat_group_name : str = f'chat_{pk}'
        await self.channel_layer.group_add(
           self.chat_group_name,
           self.channel_name 
        )
        
        
        await self.accept()
        
    async def websocket_receive(self, event):
        recived = json.loads(event.get('text'))
        print("recived: ", recived) 
        match recived.get("action", None):
            case "MessageCreated":
                await self.channel_layer.group_send(
                    self.chat_group_name,
                    {
                        "type" : "MessageCreated",
                        "text" : recived.get("data",None)
                        
                    }
                )
            case other:
                pass
        pass 
    async def MessageCreated(self, event):
        await self.send(text_data=json.dumps({
            "type" : "MessageCreated",
            "data" : event.get("text", None)
        }))    
    
        
    