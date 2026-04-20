from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("MONGO_URI")

client = MongoClient(uri)

# Test connection
client.admin.command("ping")

db = client["ai_bd_chatbot"]

contacts_col = db["contacts"]
chats_col = db["chats"]

print("MongoDB Connected Successfully")