from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class UserEntity:
    """Domain entity representing a User"""
    id: Optional[int]
    username: str
    email: str
    first_name: str
    last_name: str
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def get_full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    def validate(self) -> bool:
        """Domain validation logic"""
        if not self.username or len(self.username) < 3:
            return False
        if not self.email or '@' not in self.email:
            return False
        return True