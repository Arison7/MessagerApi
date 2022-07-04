from rest_framework import renderers




class EventStreamRender(renderers.BaseRenderer):
    media_type = "text/event-stream"
    format = "txt"
    
    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data