from typing import List, Optional
from ..domain.entities import UserEntity
from ..domain.repositories import UserRepositoryInterface
from ..models import User

class DjangoUserRepository(UserRepositoryInterface):
    """Concrete implementation of repository using Django ORM"""
    
    def _to_entity(self, model: User) -> UserEntity:
        """Convert Django model to domain entity"""
        return UserEntity(
            id=model.id,
            username=model.username,
            email=model.email,
            first_name=model.first_name,
            last_name=model.last_name,
            is_active=model.is_active,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
    
    def _to_model(self, entity: UserEntity, model: Optional[User] = None) -> User:
        """Convert domain entity to Django model"""
        if model is None:
            model = User()
        
        model.username = entity.username
        model.email = entity.email
        model.first_name = entity.first_name
        model.last_name = entity.last_name
        model.is_active = entity.is_active
        return model
    
    def get_all(self) -> List[UserEntity]:
        users = User.objects.all()
        return [self._to_entity(user) for user in users]
    
    def get_by_id(self, user_id: int) -> Optional[UserEntity]:
        try:
            user = User.objects.get(id=user_id)
            return self._to_entity(user)
        except User.DoesNotExist:
            return None
    
    def create(self, user: UserEntity) -> UserEntity:
        model = self._to_model(user)
        model.save()
        return self._to_entity(model)
    
    def update(self, user: UserEntity) -> UserEntity:
        try:
            model = User.objects.get(id=user.id)
            model = self._to_model(user, model)
            model.save()
            return self._to_entity(model)
        except User.DoesNotExist:
            raise ValueError(f"User with id {user.id} not found")
    
    def delete(self, user_id: int) -> bool:
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return True
        except User.DoesNotExist:
            return False