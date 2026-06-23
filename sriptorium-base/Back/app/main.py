from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import test_connection

app= FastAPI(title="Mecanografia API", description="Backen para web de mecanografia")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.router import api_router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"mensaje": "Sistema Ganadero API v1.0", "status": "online"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.on_event("startup")
async def startup():
    print(repr(settings.DB_NAME))
    print(repr(settings.DB_USER))
    print(repr(settings.DB_PASSWORD))
    print("🚀 Iniciando servidor...")
    print("🌐 CORS: Permitido todo")
    test_connection()
