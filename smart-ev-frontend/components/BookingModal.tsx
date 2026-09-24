"use client";

import { useState } from "react";

interface BookingModalProps {
  stationName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingDetails: {
    vehicleName: string;
    targetSoc: number;
    timeSlot: string;
  }) => void;
}

export default function BookingModal({
  stationName,
  isOpen,
  onClose,
  onConfirm,
}: BookingModalProps) {
  const [vehicleName, setVehicleName] = useState("");
  const [targetSoc, setTargetSoc] = useState(80);
  const [timeSlot, setTimeSlot] = useState("14:00 - 15:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({ vehicleName, targetSoc, timeSlot });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Reserve Slot</h2>
            <p className="text-xs text-slate-500">{stationName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Vehicle Model / Identifier
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Nexon EV / Tesla Model 3"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span className="uppercase tracking-wider">Target Charge (SoC)</span>
              <span className="text-indigo-600 font-bold">{targetSoc}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={targetSoc}
              onChange={(e) => setTargetSoc(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600"
            >
              <option value="10:00 - 11:00">10:00 AM - 11:00 AM</option>
              <option value="12:00 - 13:00">12:00 PM - 01:00 PM</option>
              <option value="14:00 - 15:00">02:00 PM - 03:00 PM</option>
              <option value="17:00 - 18:00">05:00 PM - 06:00 PM</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Locking Slot..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}