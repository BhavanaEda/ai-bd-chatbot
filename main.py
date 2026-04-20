from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os

from database import contacts_col, chats_col

load_dotenv()

app = FastAPI()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")


class ChatRequest(BaseModel):
    message: str
    user_id: str


class ContactRequest(BaseModel):
    name: str
    phone: str
    interest: str
    email: str | None = None


@app.get("/")
def home():
    return FileResponse("index.html")


@app.get("/admin")
def admin():
    return FileResponse("admin.html")


@app.post("/chat")
def chat(req: ChatRequest):
    try:
        prompt = f"""
You are an AI business development assistant for training institutes.
Help users with:
Courses, Fees, Placements, Demo classes, Career guidance.

User Message: {req.message}
"""

        response = model.generate_content(prompt)
        reply = response.text

        chats_col.insert_one({
            "user_id": req.user_id,
            "message": req.message,
            "reply": reply
        })

        return {"reply": reply}

    except Exception as e:
        return {"error": str(e)}


@app.post("/contact")
def contact(req: ContactRequest):
    try:
        lead = {
            "name": req.name,
            "phone": req.phone,
            "interest": req.interest,
            "email": req.email
        }

        inserted = contacts_col.insert_one(lead)

        return {
            "success": True,
            "id": str(inserted.inserted_id)
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.get("/analytics")
def analytics():
    return {
        "contacts": contacts_col.count_documents({}),
        "messages": chats_col.count_documents({})
    }

@app.get("/debugcontacts")
def debugcontacts():
    docs = list(contacts_col.find({}, {"name":1}).limit(5))
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs