from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('endpoints/chats/<int:pk>/', consumers.chatConsumer.as_asgi(), name="chat_ws"),
]