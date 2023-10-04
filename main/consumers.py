import json 
from channels.generic.websocket import AsyncWebsocketConsumer



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
        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                "type" : "Message",
                "text" : recived.get("data",None),
                "action" : recived.get("action", None)
                
            }
        )
        
    async def Message(self, event):
        await self.send(text_data=json.dumps({
            "type" : event.get("action", None),
            "data" : event.get("text", None)
        }))    
    
        
    