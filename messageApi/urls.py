from django.urls import include, path
from rest_framework import routers
from main import views
from django.contrib import admin
from django.contrib.auth.views import LogoutView

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet , basename= "user")
router.register(r'groups', views.GroupViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'chats', views.ChatViewSet)



urlpatterns = [
    path('endpoints/', include(router.urls)),
    path('',include('main.urls',namespace='main')),
    #path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('login/', views.MyLoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('admin/', admin.site.urls),
]


