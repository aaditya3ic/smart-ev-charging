export default function PriceComparison() {
  const pricingData = [
    {
      type: "Level 2 (AC)",
      speed: "Standard (3-22 kW)",
      offPeak: "₹15 / kWh",
      peak: "₹20 / kWh",
    },
    {
      type: "DC Fast (DCFC)",
      speed: "Fast (50-150 kW)",
      offPeak: "₹22 / kWh",
      peak: "₹30 / kWh",
    },
    {
      type: "Ultra-Fast DC",
      speed: "Ultra (150kW+)",
      offPeak: "₹28 / kWh",
      peak: "₹35 / kWh",
    },
  ];

  return (
    <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="text-xl font-bold text-slate-800">Dynamic Pricing Comparison</h2>
      <p className="mt-1 text-sm text-slate-500">
        Prices adjust dynamically based on local transformer load and time of day.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="rounded-tl-lg p-4 font-semibold">Charger Type</th>
              <th className="p-4 font-semibold">Speed</th>
              <th className="p-4 font-semibold text-emerald-600">Off-Peak (Low Load)</th>
              <th className="rounded-tr-lg p-4 font-semibold text-rose-600">Peak (High Load)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pricingData.map((row, idx) => (
              <tr key={idx} className="transition hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{row.type}</td>
                <td className="p-4 text-slate-600">{row.speed}</td>
                <td className="p-4 font-semibold text-emerald-700">{row.offPeak}</td>
                <td className="p-4 font-semibold text-rose-700">{row.peak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}