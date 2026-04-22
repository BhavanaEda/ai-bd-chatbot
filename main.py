from fastapi import FastAPI
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os
from twilio.twiml.messaging_response import MessagingResponse
from fastapi import Form

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
        response = model.generate_content(req.message)
        reply = response.text
    except:
        reply = "Thanks for contacting us."

    chats_col.insert_one({
        "user_id": req.user_id,
        "message": req.message,
        "reply": reply
    })

    return {"reply": reply}


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

@app.post("/whatsapp")
def whatsapp_bot(Body: str = Form(...), From: str = Form(...)):

    try:
        prompt = f"""
You are CampusConnect AI WhatsApp Assistant.

You can answer all questions intelligently.

Rules:
1. If user asks about courses, fees, placements, batches,
career guidance, certifications, admissions:
reply like a professional training institute counselor.

2. If user asks coding, technology, resume, interview,
general knowledge, productivity, careers or normal questions:
reply like a smart AI assistant.

3. Keep answers short, clear and helpful.

4. Encourage users to share name and phone number
if they want counseling or admissions support.

User Message: {Body}
"""

        response = model.generate_content(prompt)
        reply = response.text

    except Exception:
        reply = "Thanks for contacting CampusConnect AI. Please try again shortly."

    chats_col.insert_one({
        "user_id": From,
        "message": Body,
        "reply": reply,
        "source": "whatsapp"
    })

    twilio_response = MessagingResponse()
    twilio_response.message(reply)

    return Response(
        content=str(twilio_response),
        media_type="application/xml"
    )