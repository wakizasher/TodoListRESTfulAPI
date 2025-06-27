from enum import Enum
from sqlalchemy import Integer, TIMESTAMP, String, Column, text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship

from .database import Base


class TaskStatus(Enum):
    planned = "planned"
    in_progress = "in-progress"
    done = "done"


class Task(Base):
    __tablename__ = 'tasks'
    task_id = Column(Integer,primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id",
                                         ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    progress = Column(SQLEnum(TaskStatus), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text('now()'),
                        onupdate=text('now()'))
    owner = relationship("User")

class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text('now()'))

