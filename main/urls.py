
from django.urls import include, path
from . import views


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.

app_name = 'main'

urlpatterns = [
    path('', views.mainWindowView, name='mainWindow'),
    path('api-auth/register/' , views.RegisterView.as_view(), name='register'),
    #path('endpoints/chats/<int:pk>/eventSource/', views.EventView)
    
]

