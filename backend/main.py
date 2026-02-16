from fastapi import FastAPI, Depends, HTTPException
from database import SessionLocal, engine
from models import Base, Machine
from schemas import MachineCreate, MachineResponse
from typing import List

from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create tables if not existing yet
Base.metadata.create_all(bind=engine)

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE
@app.post("/machines", response_model=MachineResponse)
def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):
    db_machine = Machine(**machine.model_dump())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine

# READ ALL
@app.get("/machines", response_model=List[MachineResponse])
def get_machines(db: Session = Depends(get_db)):
    return db.query(Machine).all()

# READ ONE
@app.get("/machines/{machine_id}", response_model=MachineResponse)
def get_machine(machine_id: str, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Nicht gefunden")
    return machine

# UPDATE
@app.put("/machines/{machine_id}", response_model=MachineResponse)
def update_machine(machine_id: str, machine: MachineCreate, db: Session = Depends(get_db)):
    db_machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Nicht gefunden")

    for key, value in machine.dict().items():
        setattr(db_machine, key, value)

    db.commit()
    db.refresh(db_machine)
    return db_machine

# DELETE
@app.delete("/machines/{machine_id}")
def delete_machine(machine_id: str, db: Session = Depends(get_db)):
    db_machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Nicht gefunden")

    db.delete(db_machine)
    db.commit()
    return {"message": "Gelöscht"}