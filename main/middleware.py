from django.conf import settings
from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token

"""
Middleware to set the default user for the development environment
* In order to prevent dealing with users authentication during frontend development all request will get the default user
"""
class DefaultUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.DEBUG and not request.user.is_authenticated:
            # Get the default user for the development environment
            User = get_user_model()
            default_user, _ = User.objects.get_or_create(username='defaultuser')

            # Set the default user on the request object
            request.user = default_user

        response = self.get_response(request)
        return response
    
"""
Middleware to set the default user for the development environment
* Neglects CSRF protection during frontend development
"""
class DisableCSRFMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if settings.DEBUG:
            # Disable CSRF protection for development by adding a valid one to every response
            response['X-CSRFToken'] = get_token(request)
        return response
