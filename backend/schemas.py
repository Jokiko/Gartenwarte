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


class Machine(MachineBase):
    id: str
    past_maintenances: List[Maintenance] = []

    class Config:
        from_attributes = True

class MachineCreate(MachineBase):
    pass

class MachineResponse(MachineBase):
    id: str

    class Config:
        from_attributes = True

