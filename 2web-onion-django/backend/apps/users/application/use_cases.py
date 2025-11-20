from typing import List, Optional
from ..domain.entities import UserEntity
from ..domain.repositories import UserRepositoryInterface

class GetAllUsersUseCase:
    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository
    
    def execute(self) -> List[UserEntity]:
        return self.repository.get_all()

class GetUserByIdUseCase:
    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository
    
    def execute(self, user_id: int) -> Optional[UserEntity]:
        return self.repository.get_by_id(user_id)

class CreateUserUseCase:
    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository
    
    def execute(self, user: UserEntity) -> UserEntity:
        if not user.validate():
            raise ValueError("Invalid user data")
        return self.repository.create(user)

class UpdateUserUseCase:
    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository
    
    def execute(self, user: UserEntity) -> UserEntity:
        if not user.validate():
            raise ValueError("Invalid user data")
        return self.repository.update(user)

class DeleteUserUseCase:
    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository
    
    def execute(self, user_id: int) -> bool:
        return self.repository.delete(user_id)