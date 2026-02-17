from fastapi import FastAPI, Depends, HTTPException,UploadFile, File
from fastapi.staticfiles import StaticFiles
from database import SessionLocal, engine
from models import Base, Machine, MachineFile
from schemas import MachineCreate, MachineResponse
from typing import List
from pathlib import Path
from utils import get_app_data_dir
import os
import shutil
import uuid


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


# create upload folder in appdata folder
BASE_DATA_DIR = get_app_data_dir()
UPLOAD_DIR = BASE_DATA_DIR / "uploads" / "machines"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(BASE_DATA_DIR / "uploads")), name="uploads")

# helper function to get each machine's doc and image folders and creates them if they don't exist yet
def get_machine_folder(machine_id: str):
    base_path = UPLOAD_DIR / machine_id
    image_path = base_path / "images"
    document_path = base_path / "documents"

    image_path.mkdir(parents=True, exist_ok=True)
    document_path.mkdir(parents=True, exist_ok=True)

    return image_path, document_path


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

    # delete the file folder of this machine
    folder_path = BASE_DATA_DIR / "uploads" / "machines" / machine_id
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)

    db.delete(db_machine)
    db.commit()
    return {"message": "Gelöscht"}


@app.post("/machines/{machine_id}/upload")
def upload_file(
    machine_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Maschine nicht gefunden")

    image_path, document_path = get_machine_folder(machine_id)

    # Dateityp bestimmen
    if file.content_type.startswith("image/"):
        target_folder = image_path
        file_type = "image"
    else:
        target_folder = document_path
        file_type = "document"


    file_extension = file.filename.split(".")[-1]
    new_filename = f"{uuid.uuid4()}.{file_extension}"
    absolute_path = target_folder / new_filename

    with absolute_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    relative_path = Path("machines") / machine_id / target_folder.name / new_filename

    db_file = MachineFile(
        machine_id=machine_id,
        file_path=str(relative_path),
        original_filename=file.filename,
        file_type=file_type,
        mime_type=file.content_type
    )

    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return db_file



@app.delete("/files/{file_id}")
def delete_file(file_id: str, db: Session = Depends(get_db)):
    db_file = db.query(MachineFile).filter(MachineFile.id == file_id).first()

    if not db_file:
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")

    # delete physical file
    if os.path.exists(db_file.file_path):
        os.remove(db_file.file_path)

    # delete DB entry
    db.delete(db_file)
    db.commit()

    return {"message": "Datei gelöscht"}