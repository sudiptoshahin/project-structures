from django.urls import path
# from .views import UserListView, UserDetailView

from apps.users.presentation.views import UserListView, UserDetailView

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('detail/', UserDetailView.as_view(), name='user-detail'),
]