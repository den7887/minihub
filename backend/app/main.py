from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель для запроса /echo
class EchoRequest(BaseModel):
    text: str = Field(..., min_length=1)

# Модель для ответа /echo
class EchoResponse(BaseModel):
    received: str
    length: int

@app.get("/health")
def health_check():
    return {"ok": True}

@app.post("/echo", response_model=EchoResponse)
def echo(request: EchoRequest):
    return {"received": request.text, "length": len(request.text)}
