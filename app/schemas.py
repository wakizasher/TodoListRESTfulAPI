from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from .models import TaskStatus


class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    email: EmailStr
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TaskBase(BaseModel):
    title: str
    content: str
    progress: TaskStatus


class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: str = None
    content: str = None
    progress: TaskStatus = None

class TaskResponse(TaskBase):
    task_id: int
    user_id: int
    owner: UserResponse
    created_at: datetime
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None