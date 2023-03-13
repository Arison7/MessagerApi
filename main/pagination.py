from rest_framework.pagination import LimitOffsetPagination



class MessagePagination(LimitOffsetPagination):
    #? Little addition for cleaner requests
	default_limit = 15