from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DB_HOST: str = 'localhost'
    DB_PORT: int = 5432
    DB_NAME: str = 'scritorium'
    DB_USER: str = 'backend_user'
    DB_PASSWORD: str = '1234'

    API_V1_PREFIX: str = 'api/v1'
    PROJECT_NAME: str = 'Scriptorioum'

    SECRET_KEY: str = 'Clave_secreta_que_no_se_para_que_sirve'
    ALGORITHM_NAME: str = "HS256"
    ACCES_TOKEN_EXPIRE_MINUTES: int = 480

    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()