from .. import models, schemas, oauth2
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from ..database import engine, get_db, Base
from typing import List, Optional
from sqlalchemy import or_
from ..oauth2 import get_current_user
from ..schemas import TaskCreate, TaskResponse, UserCreate, UserResponse, TokenData


router = APIRouter(prefix="/tasks",
                   tags=['Tasks'])


@router.get("/", response_model=List[schemas.TaskResponse]) #read all tas ks
async def root(db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user),
               limit = 10,
               skip: int = 0,
               search: Optional[str] = None,
               status: Optional[str] = None):
    tasks = db.query(models.Task).filter(models.Task.user_id == current_user.id)
    if search:
        tasks = tasks.filter(or_(models.Task.progress.contains(search), models.Task.content.contains(search)))
    if status:
        tasks = tasks.filter(models.Task.progress == status)
    new_tasks = tasks.offset(skip).limit(limit).all()
    return new_tasks


@router.get("/{id}", response_model=schemas.TaskResponse) #read one task
async def read_single_task(id: int, db: Session = Depends(get_db),
                           current_user: schemas.TokenData = Depends(oauth2.get_current_user)):
    task = db.query(models.Task).filter(models.Task.task_id == id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Task with id: {id} not found")
    if task.user_id != int(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")
    return task


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.TaskResponse) #create task
async def write_task(task: TaskCreate, db: Session = Depends(get_db),
                     current_user: int = Depends(oauth2.get_current_user)):
    db_task = models.Task(user_id=current_user.id,**task.model_dump())
    db.add(db_task) # Add it to the session
    db.commit() # Save to the database
    db.refresh(db_task) # Refresh to get the generated fields
    return db_task


@router.put("/{id}") # update task
async def update_task(task: schemas.TaskCreate,id: int, db: Session = Depends(get_db),
                      current_user: schemas.TokenData = Depends(oauth2.get_current_user)):
    updating_task = db.query(models.Task).filter(models.Task.task_id == id)
    existing_task = updating_task.first()
    if existing_task == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Task with id: {id} was not found")
    if existing_task.user_id != int(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")
    updating_task.update(task.model_dump(), synchronize_session=False)
    db.commit()
    return updating_task.first()


@router.delete("/{id}")
async def delete_task(id: int, db: Session = Depends(get_db),
                      current_user: schemas.TokenData = Depends(oauth2.get_current_user)):
    task_query = db.query(models.Task).filter(models.Task.task_id == id)
    deleting_task = task_query.first()
    if deleting_task == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Task with id: {id} was not found")
    if deleting_task.user_id != int(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")
    task_query.delete(synchronize_session=False)
    db.commit()
    return f"Task with id {id} was deleted"