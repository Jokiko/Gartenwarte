cd $PSScriptRoot\backend

if (Test-Path "venv") {
    .\venv\Scripts\Activate.ps1
}

uvicorn main:app --reload