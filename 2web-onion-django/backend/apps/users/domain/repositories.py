from abc import ABC, abstractmethod
from typing import List, Optional
from .entities import UserEntity

class UserRepositoryInterface(ABC):
    """Repository interface - part of domain layer"""
    
    @abstractmethod
    def get_all(self) -> List[UserEntity]:
        pass
    
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[UserEntity]:
        pass
    
    @abstractmethod
    def create(self, user: UserEntity) -> UserEntity:
        pass
    
    @abstractmethod
    def update(self, user: UserEntity) -> UserEntity:
        pass
    
    @abstractmethod
    def delete(self, user_id: int) -> bool:
        pass