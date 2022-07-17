from django.apps import AppConfig
import os


class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'
    """ 
    def ready(self):
        
        from . import tasks
        if os.environ.get('RUN_MAIN', None) != 'true':
            tasks.start_scheduler()
    
    def ready(self):
        print("starting scheduler")
        from .heartbeat import heartbeat_sender
        heartbeat_sender.start()
    """