from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class MaintenanceBase(BaseModel):
    maintenance_date: date


class Maintenance(MaintenanceBase):
    id: str

    class Config:
        from_attributes = True


class MachineBase(BaseModel):
    name: str
    category: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_price: Optional[float] = None
    vendor: Optional[str] = None
    manufacturer: Optional[str] = None
    next_maintenance_date: Optional[date] = None
    afa: Optional[float] = None
    notes: Optional[str] = None



class MachineFile(BaseModel):
    id: str
    file_path: str
    original_filename: Optional[str] = None
    file_type: str              # "image" | "document"
    mime_type: Optional[str] = None

    class Config:
        from_attributes = True


class Machine(MachineBase):
    id: str
    past_maintenances: List[Maintenance] = []
    files: List[MachineFile] = []

    class Config:
        from_attributes = True

class MachineCreate(MachineBase):
    pass

class MachineResponse(MachineBase):
    id: str
    files: List[MachineFile] = []

    class Config:
        from_attributes = True
