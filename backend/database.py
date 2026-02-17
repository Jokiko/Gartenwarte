from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from utils import get_app_data_dir


BASE_DATA_DIR = get_app_data_dir()
db_path = BASE_DATA_DIR / "garten.db"

SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()