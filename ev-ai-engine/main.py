from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

app = FastAPI(title="Smart EV AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. LOCAL FILE DATABASE SETUP
# ==========================================
DB_FILE = "database.json"

DEFAULT_STATIONS = [
    {
        "id": "st-1", "name": "Central Hub Station", "location": "Sector 62, Metro Corridor",
        "totalSlots": 6, "availableSlots": 4, "maxPowerKw": 50,
        "transformerCapacityKw": 180, "currentLoadKw": 95,
    },
    {
        "id": "st-2", "name": "Tech Park Supercharger", "location": "Block B, Expressway",
        "totalSlots": 8, "availableSlots": 1, "maxPowerKw": 120,
        "transformerCapacityKw": 350, "currentLoadKw": 310,
    },
    {
        "id": "st-3", "name": "Green Valley Station", "location": "Ring Road North",
        "totalSlots": 4, "availableSlots": 3, "maxPowerKw": 22,
        "transformerCapacityKw": 80, "currentLoadKw": 30,
    },
]

def load_db():
    # If the database file doesn't exist yet, create it with default data
    if not os.path.exists(DB_FILE):
        data = {"stations": DEFAULT_STATIONS, "bookings": []}
        save_db(data)
        return data
    
    # Read the existing data
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_db(data):
    # Write data to the local file
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

# ==========================================
# 2. API ENDPOINTS
# ==========================================
class BookingRequest(BaseModel):
    stationId: str
    vehicleName: str
    targetSoc: int
    timeSlot: str

@app.get("/")
def read_root():
    return {"status": "AI Engine is running with Local JSON Database"}

@app.get("/api/stations")
def get_stations_with_predictions():
    db_data = load_db()
    stations = db_data["stations"]
    
    for station in stations:
        utilization = station["currentLoadKw"] / station["transformerCapacityKw"]
        if utilization > 0.80:
            station["predictedDemand"] = "High"
        elif utilization > 0.45:
            station["predictedDemand"] = "Moderate"
        else:
            station["predictedDemand"] = "Low"
            
    return stations

@app.post("/api/book")
def book_slot(payload: BookingRequest):
    db_data = load_db()
    
    # Find station
    station = next((s for s in db_data["stations"] if s["id"] == payload.stationId), None)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    if station["availableSlots"] <= 0:
        raise HTTPException(status_code=400, detail="No slots available")

    # Dynamic Power Allocation
    base_demand = (payload.targetSoc / 100.0) * station["maxPowerKw"]
    remaining_transformer_headroom = station["transformerCapacityKw"] - station["currentLoadKw"]

    if remaining_transformer_headroom <= 5:
        raise HTTPException(status_code=429, detail="Local grid overloaded.")

    allocated_power = round(min(base_demand, remaining_transformer_headroom), 1)

    # Mutate station state
    station["availableSlots"] -= 1
    station["currentLoadKw"] += allocated_power

    # Record booking
    booking_record = {
        "id": f"res-{len(db_data['bookings']) + 1}",
        "stationId": payload.stationId,
        "vehicleName": payload.vehicleName,
        "timeSlot": payload.timeSlot,
        "allocatedPowerKw": allocated_power,
    }
    db_data["bookings"].append(booking_record)

    # Save everything back to the file permanently
    save_db(db_data)

    return {
        "status": "success",
        "message": f"Slot successfully reserved for {payload.vehicleName}",
        "allocated_power_kw": allocated_power,
    }