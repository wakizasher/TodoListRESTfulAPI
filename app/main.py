from fastapi import FastAPI
from .database import engine, Base
from .routers import task, user, auth
from .config import settings



Base.metadata.create_all(bind=engine)  # Creates fresh tables
app = FastAPI()

app.include_router(task.router)
app.include_router(user.router)
app.include_router(auth.router)


