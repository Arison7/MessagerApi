from django.urls import include, path
from rest_framework import routers
from main import views
from django.contrib import admin

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet , basename= "user")
router.register(r'groups', views.GroupViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'chats', views.ChatViewSet)



urlpatterns = [
    path('endpoints/', include(router.urls)),
    path('',include('main.urls',namespace='main')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
]



