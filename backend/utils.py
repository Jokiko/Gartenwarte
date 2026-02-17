from pathlib import Path
import os

def get_app_data_dir() -> Path:
    if os.name == "nt":  # Windows
        base = Path(os.getenv("LOCALAPPDATA"))
    else:  # macOS / Linux
        base = Path.home() / ".local" / "share"

    app_dir = base / "GartenWarte"
    app_dir.mkdir(parents=True, exist_ok=True)
    return app_dir