"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";

interface StationProps {
  id: string;
  name: string;
  location: string;
  totalSlots: number;
  availableSlots: number;
  predictedDemand: "Low" | "Moderate" | "High";
  maxPowerKw: number;
}

export default function StationCard({
  name,
  location,
  totalSlots,
  availableSlots: initialSlots,
  predictedDemand,
  maxPowerKw,
}: StationProps) {
  const [soc, setSoc] = useState(25);
  const [availableSlots, setAvailableSlots] = useState(initialSlots);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookedStatus, setBookedStatus] = useState<string | null>(null);

  const allocatedPower =
    soc < 30 ? maxPowerKw : Math.round(maxPowerKw * (1 - (soc - 30) / 100));

  const demandColor =
    predictedDemand === "Low"
      ? "bg-emerald-100 text-emerald-700"
      : predictedDemand === "Moderate"
      ? "bg-amber-100 text-amber-700"
      : "bg-rose-100 text-rose-700";

  const handleBookingConfirm = (details: {
    vehicleName: string;
    targetSoc: number;
    timeSlot: string;
  }) => {
    if (availableSlots > 0) {
      setAvailableSlots((prev) => prev - 1);
      setBookedStatus(`Reserved for ${details.vehicleName} (${details.timeSlot})`);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{name}</h3>
              <p className="text-sm text-slate-500">{location}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${demandColor}`}>
              AI Load: {predictedDemand}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-center">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Available Slots</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                {availableSlots}{" "}
                <span className="text-sm font-normal text-slate-400">/ {totalSlots}</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Allocated Power</p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">
                {allocatedPower} <span className="text-sm font-normal text-slate-400">kW</span>
              </p>
            </div>
          </div>

          {/* Battery SoC Slider Simulation */}
          <div className="mt-5">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Simulate Vehicle SoC</span>
              <span>{soc}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={soc}
              onChange={(e) => setSoc(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
            />
          </div>

          {bookedStatus && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-2.5 text-center text-xs font-medium text-emerald-800 border border-emerald-100">
              ✓ {bookedStatus}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={availableSlots === 0}
          className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {availableSlots === 0 ? "No Slots Available" : "Reserve Charging Slot"}
        </button>
      </div>

      <BookingModal
        stationName={name}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBookingConfirm}
      />
    </>
  );
}