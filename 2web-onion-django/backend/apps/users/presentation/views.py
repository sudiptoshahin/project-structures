from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..domain.entities import UserEntity
from ..infrastructure.repository_impl import DjangoUserRepository
from ..application.use_cases import (
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase
)
from .serializers import UserSerializer

class UserListView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = DjangoUserRepository()
    
    def get(self, request):
        use_case = GetAllUsersUseCase(self.repository)
        users = use_case.execute()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user_entity = UserEntity(
                id=None,
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name'],
                is_active=serializer.validated_data.get('is_active', True)
            )
            
            try:
                use_case = CreateUserUseCase(self.repository)
                created_user = use_case.execute(user_entity)
                response_serializer = UserSerializer(created_user)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = DjangoUserRepository()
    
    def get(self, request, pk):
        use_case = GetUserByIdUseCase(self.repository)
        user = use_case.execute(pk)
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data)
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user_entity = UserEntity(
                id=pk,
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name'],
                is_active=serializer.validated_data.get('is_active', True)
            )
            
            try:
                use_case = UpdateUserUseCase(self.repository)
                updated_user = use_case.execute(user_entity)
                response_serializer = UserSerializer(updated_user)
                return Response(response_serializer.data)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        use_case = DeleteUserUseCase(self.repository)
        success = use_case.execute(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)