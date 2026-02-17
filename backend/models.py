# models.py
from sqlalchemy import Column, String, Float, Date, Integer, ForeignKey
from sqlalchemy.orm import relationship

from database import Base
import uuid

class Machine(Base):
    __tablename__ = "machines"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    manufacturing_year = Column(String, nullable=True)
    category = Column(String, nullable=True)
    original_price = Column(Float, nullable=True)
    purchase_date = Column(Date, nullable=True)
    purchase_price = Column(Float, nullable=True)
    vendor = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)
    next_maintenance_date = Column(Date, nullable=True)
    last_maintenance_date = Column(Date, nullable=True)
    last_maintenance_costs = Column(Float, nullable=True)
    article_number = Column(String, nullable=True)
    notes = Column(String)
    afa = Column(Float)


    past_maintenances = relationship(
        "Maintenance",
        back_populates="machine",
        cascade="all, delete-orphan"
    )


    files = relationship(
        "MachineFile",
        back_populates="machine",
        cascade="all, delete-orphan"
    )


class Maintenance(Base):
    __tablename__ = "maintenances"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    maintenance_date = Column(Date, nullable=False)

    machine_id = Column(String, ForeignKey("machines.id"))
    machine = relationship("Machine", back_populates="past_maintenances")


class MachineFile(Base):
    __tablename__ = "machine_files"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    file_path = Column(String, nullable=False)
    original_filename = Column(String)
    file_type = Column(String)  # "image" | "document"
    mime_type = Column(String)

    machine_id = Column(String, ForeignKey("machines.id", ondelete="CASCADE"))
    machine = relationship("Machine", back_populates="files")
