import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const CustomPackage = () => {
  const sriLankaDestinations = [
    { id: 'cmb', name: 'Colombo', region: 'West', image: 'https://images.unsplash.com/photo-1622219881570-2b63a64a6b9c?auto=format&fit=crop&w=1200&q=60' },
    { id: 'gae', name: 'Galle', region: 'South', image: 'https://images.unsplash.com/photo-1548786811-ff986a5ac6cf?auto=format&fit=crop&w=1200&q=60' },
    { id: 'ell', name: 'Ella', region: 'Hill Country', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=60' },
    { id: 'sig', name: 'Sigiriya', region: 'Cultural Triangle', image: 'https://images.unsplash.com/photo-1611689342702-6b2938340f6e?auto=format&fit=crop&w=1200&q=60' },
    { id: 'nuw', name: 'Nuwara Eliya', region: 'Hill Country', image: 'https://images.unsplash.com/photo-1592407150642-1bca8c1f0f09?auto=format&fit=crop&w=1200&q=60' },
    { id: 'tri', name: 'Trincomalee', region: 'East Coast', image: 'https://images.unsplash.com/photo-1573497491744-59b00f1f1b4c?auto=format&fit=crop&w=1200&q=60' },
    { id: 'aru', name: 'Arugam Bay', region: 'East Coast', image: 'https://images.unsplash.com/photo-1546421845-6471bdcf3b05?auto=format&fit=crop&w=1200&q=60' },
    { id: 'yala', name: 'Yala', region: 'South', image: 'https://images.unsplash.com/photo-1589307004173-3dd10b572383?auto=format&fit=crop&w=1200&q=60' },
  ];

  const hotels = [
    { id: '3s', name: 'Comfort (3★)', stars: 3, pricePerNight: 45 },
    { id: '4s', name: 'Premium (4★)', stars: 4, pricePerNight: 85 },
    { id: '5s', name: 'Luxury (5★)', stars: 5, pricePerNight: 160 },
    { id: 'vil', name: 'Boutique/Villa', stars: 5, pricePerNight: 220 },
  ];

  const vehicles = [
    { id: 'car', name: 'Car (1-3 pax)', pricePerDay: 55 },
    { id: 'van', name: 'Van (4-8 pax)', pricePerDay: 80 },
    { id: 'mini', name: 'Mini Coach (9-15 pax)', pricePerDay: 130 },
    { id: 'suv', name: 'SUV (comfort)', pricePerDay: 95 },
  ];

  const guides = [
    { id: 'none', name: 'No Guide', pricePerDay: 0 },
    { id: 'loc', name: 'Local English-speaking Guide', pricePerDay: 35 },
    { id: 'lic', name: 'Licensed National Guide', pricePerDay: 60 },
    { id: 'multi', name: 'Multilingual Guide', pricePerDay: 75 },
  ];

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [nightsByDestination, setNightsByDestination] = useState({});
  const [hotelTier, setHotelTier] = useState(hotels[1]);
  const [vehicle, setVehicle] = useState(vehicles[0]);
  const [guide, setGuide] = useState(guides[1]);
  const [travellers, setTravellers] = useState(2);
  const [startDate, setStartDate] = useState('');

  // Rough normalized coordinates for Sri Lankan destinations (0..1 in container)
  const mapCoords = {
    cmb: { x: 0.28, y: 0.72 }, // Colombo (West)
    gae: { x: 0.30, y: 0.88 }, // Galle (South)
    ell: { x: 0.48, y: 0.70 }, // Ella (Hill Country)
    sig: { x: 0.46, y: 0.38 }, // Sigiriya (Central North)
    nuw: { x: 0.44, y: 0.62 }, // Nuwara Eliya
    tri: { x: 0.78, y: 0.28 }, // Trincomalee (East)
    aru: { x: 0.84, y: 0.62 }, // Arugam Bay (SE/East)
    yala: { x: 0.60, y: 0.86 }, // Yala (South East)
  };

  const totalNights = useMemo(() =>
    selectedDestinations.reduce((sum, d) => sum + (nightsByDestination[d.id] || 0), 0)
  , [selectedDestinations, nightsByDestination]);

  const hotelCost = useMemo(() => totalNights * hotelTier.pricePerNight * travellers, [totalNights, hotelTier, travellers]);
  const transportCost = useMemo(() => Math.max(1, totalNights) * vehicle.pricePerDay, [totalNights, vehicle]);
  const guideCost = useMemo(() => Math.max(1, totalNights) * guide.pricePerDay, [totalNights, guide]);
  const taxes = useMemo(() => 0.1 * (hotelCost + transportCost + guideCost), [hotelCost, transportCost, guideCost]);
  const totalCost = useMemo(() => hotelCost + transportCost + guideCost + taxes, [hotelCost, transportCost, guideCost, taxes]);

  const toggleDestination = (dest) => {
    setSelectedDestinations((prev) =>
      prev.find((d) => d.id === dest.id)
        ? prev.filter((d) => d.id !== dest.id)
        : [...prev, dest]
    );
    setNightsByDestination((prev) => ({ ...prev, [dest.id]: prev[dest.id] || 1 }));
  };

  const setNights = (destId, value) => {
    const v = Math.max(0, Math.min(10, Number(value) || 0));
    setNightsByDestination((prev) => ({ ...prev, [destId]: v }));
  };

  const navigate = useNavigate();
  const handleProceed = () => {
    // In a real app, send payload to backend or move to checkout
    const payload = {
      startDate,
      travellers,
      itinerary: selectedDestinations.map((d) => ({ id: d.id, name: d.name, nights: nightsByDestination[d.id] || 0 })),
      hotelTier,
      vehicle,
      guide,
      totals: { totalNights, hotelCost, transportCost, guideCost, taxes, totalCost },
    };
    console.log('Custom Package:', payload);
    navigate('/bookings');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Build Your Sri Lanka Trip</h1>
          <p className="text-gray-600 text-lg">Choose destinations, hotels, vehicles and guides to craft your own experience.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Destination selection */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Destinations & Nights</h2>
              <p className="text-sm text-gray-600 mb-4">Pick your stops and assign nights for each location.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sriLankaDestinations.map((d) => {
                  const active = selectedDestinations.find((x) => x.id === d.id);
                  return (
                    <div key={d.id} className={`group relative overflow-hidden rounded-xl border ${active ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'} bg-white shadow-sm`}> 
                      <img src={d.image} alt={d.name} className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-900 font-medium">{d.name}</div>
                            <div className="text-xs text-gray-500">{d.region}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleDestination(d)}
                            className={`px-3 py-1 text-sm rounded-md ${active ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-primary-50 text-primary-700 border border-primary-200'} hover:opacity-90`}
                          >
                            {active ? 'Remove' : 'Add'}
                          </button>
                        </div>
                        {active && (
                          <div className="mt-3 flex items-center gap-3">
                            <label className="text-sm text-gray-600">Nights</label>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={nightsByDestination[d.id] || 1}
                              onChange={(e) => setNights(d.id, e.target.value)}
                              className="w-20 rounded-md border border-gray-300 px-2 py-1 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Itinerary Map */}
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Itinerary Map</h2>
              <p className="text-sm text-gray-600 mb-4">Preview your route across Sri Lanka. Order follows selection.</p>
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-slate-100" style={{ aspectRatio: '16 / 10' }}>
                {/* Background map image */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Sri_Lanka_districts_map.png/800px-Sri_Lanka_districts_map.png"
                  alt="Sri Lanka map"
                  className="absolute inset-0 h-full w-full object-contain bg-gradient-to-b from-sky-50 to-slate-100"
                />

                {/* SVG path connecting points */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  {selectedDestinations.length >= 2 && (
                    <polyline
                      fill="none"
                      stroke="#0c1c2e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={selectedDestinations
                        .map((d) => mapCoords[d.id])
                        .filter(Boolean)
                        .map((c) => `${(c.x * 100).toFixed(2)},${(c.y * 100).toFixed(2)}`)
                        .join(' ')}
                      opacity="0.9"
                    />
                  )}

                  {selectedDestinations.map((d, idx) => {
                    const c = mapCoords[d.id];
                    if (!c) return null;
                    const x = c.x * 100;
                    const y = c.y * 100;
                    return (
                      <g key={d.id}>
                        <circle cx={x} cy={y} r={2} fill="#0c1c2e" stroke="#ffffff" strokeWidth={0.8} />
                        <text x={x + 2.8} y={y} fontSize={3.2} alignmentBaseline="middle" fill="#111827" stroke="#ffffff" strokeWidth={0.6} paintOrder="stroke">
                          {idx + 1}. {d.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              {selectedDestinations.length === 0 && (
                <div className="mt-2 text-sm text-gray-500">Add destinations to visualize your route.</div>
              )}
            </section>

            {/* Preferences */}
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hotel Tier</h3>
                <div className="space-y-2">
                  {hotels.map((h) => (
                    <label key={h.id} className={`flex items-center justify-between rounded-md border p-3 cursor-pointer ${hotelTier.id === h.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                      <div>
                        <div className="font-medium text-gray-900">{h.name}</div>
                        <div className="text-xs text-gray-500">${h.pricePerNight}/night per person</div>
                      </div>
                      <input type="radio" name="hotel" checked={hotelTier.id === h.id} onChange={() => setHotelTier(h)} />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vehicle</h3>
                <div className="space-y-2">
                  {vehicles.map((v) => (
                    <label key={v.id} className={`flex items-center justify-between rounded-md border p-3 cursor-pointer ${vehicle.id === v.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                      <div>
                        <div className="font-medium text-gray-900">{v.name}</div>
                        <div className="text-xs text-gray-500">${v.pricePerDay}/day per group</div>
                      </div>
                      <input type="radio" name="vehicle" checked={vehicle.id === v.id} onChange={() => setVehicle(v)} />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Guide</h3>
                <div className="space-y-2">
                  {guides.map((g) => (
                    <label key={g.id} className={`flex items-center justify-between rounded-md border p-3 cursor-pointer ${guide.id === g.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                      <div>
                        <div className="font-medium text-gray-900">{g.name}</div>
                        <div className="text-xs text-gray-500">${g.pricePerDay}/day per group</div>
                      </div>
                      <input type="radio" name="guide" checked={guide.id === g.id} onChange={() => setGuide(g)} />
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right: Trip details & pricing */}
          <aside className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Trip Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Travellers</label>
                    <input type="number" min={1} max={20} value={travellers} onChange={(e) => setTravellers(Math.max(1, Number(e.target.value)||1))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200" />
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Itinerary</div>
                  {selectedDestinations.length === 0 ? (
                    <div className="text-sm text-gray-500">No destinations selected yet.</div>
                  ) : (
                    <ul className="text-sm text-gray-800 space-y-1">
                      {selectedDestinations.map((d) => (
                        <li key={d.id} className="flex items-center justify-between">
                          <span>{d.name}</span>
                          <span className="text-gray-600">{nightsByDestination[d.id] || 0} night(s)</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Price Summary</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between"><span>Hotel ({totalNights} nights × ${hotelTier.pricePerNight} × {travellers} pax)</span><span>${hotelCost.toFixed(2)}</span></li>
                <li className="flex justify-between"><span>Transport ({Math.max(1, totalNights)} day(s))</span><span>${transportCost.toFixed(2)}</span></li>
                <li className="flex justify-between"><span>Guide ({Math.max(1, totalNights)} day(s))</span><span>${guideCost.toFixed(2)}</span></li>
                <li className="flex justify-between text-gray-500"><span>Taxes (10%)</span><span>${taxes.toFixed(2)}</span></li>
                <li className="flex justify-between font-semibold text-gray-900 border-t pt-2"><span>Total</span><span>${totalCost.toFixed(2)}</span></li>
              </ul>
              <button
                onClick={handleProceed}
                disabled={selectedDestinations.length === 0}
                className="mt-4 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              <p className="text-xs text-gray-500 mt-2">This is an instant estimate. Final price may vary based on availability.</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CustomPackage; 