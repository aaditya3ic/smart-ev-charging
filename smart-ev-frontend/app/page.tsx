import StationCard from "../components/StationCard";
import PriceComparison from "../components/PriceComparison";
import Link from "next/link";
export default async function Home() {
  let stations = [];
  try {
    const res = await fetch("https://ev-ai-engine.onrender.com/api/stations", {
      cache: "no-store",
    });
    stations = await res.json();
  } catch (error) {
    console.error("Failed to fetch from Python backend:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Smart AI EV Charging
            </h1>
            <p className="mt-1 text-slate-500">
              Dynamic load balancing and LSTM availability forecasting.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-800">Grid Optimal</span>
            </div>

            
          </div>
        </div>

        {/* Station Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stations.length > 0 ? (
            stations.map((station: any) => (
              <StationCard key={station.id} {...station} />
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-rose-100 bg-rose-50 p-6 text-center text-rose-600">
              Warning: Cannot connect to the AI Engine. Is the Python server running?
            </div>
          )}
        </div>

        {/* Price Comparison Matrix */}
        <PriceComparison />
        
      </div>
    </main>
  );
}