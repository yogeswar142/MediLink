import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../api";
import Navbar from "../components/Navbar";

export default function MedicineAvailability() {
  const { t } = useTranslation();
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/medicine/shops`)
      .then(r => r.json())
      .then(data => {
        if(data.success) setShops(data.shops);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStockBadge = (stock) => {
    if (stock === "In Stock") return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs border border-emerald-500/30">{t("inStock") || stock}</span>;
    if (stock === "Low") return <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs border border-amber-500/30">{t("lowStock") || stock}</span>;
    return <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs border border-red-500/30">{t("outOfStock") || stock}</span>;
  };

  const filteredShops = shops.map(shop => {
    return {
      ...shop,
      medicines: shop.medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    };
  }).filter(shop => shop.name.toLowerCase().includes(search.toLowerCase()) || shop.medicines.length > 0);

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-500/10 rounded-full blur-3xl -z-10 mix-blend-screen"></div>
      
      <div className="max-w-6xl mx-auto pb-12">
        <Navbar role="patient" />

        <div className="px-6 mt-8 mb-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3 mb-6">
            <span className="text-4xl">💊</span> {t("medicineAvailability") || "Medicine Availability"}
          </h2>
          
          <div className="relative max-w-xl">
             <input 
               type="text" 
               placeholder="Search medicines or shops..." 
               className="input pl-12 py-4 shadow-xl"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
             <svg className="w-6 h-6 absolute left-4 top-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin"></div></div>
        ) : (
          <div className="px-6 grid lg:grid-cols-2 gap-6 animate-[fadeIn_0.5s_ease-out_0.2s_both]">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="glass rounded-xl overflow-hidden hover:-translate-y-1 transition-transform border border-slate-700/50">
                <div className="bg-slate-800/80 p-5 border-b border-slate-700/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl text-slate-100">{shop.name}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {shop.location}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center">🏪</div>
                </div>
                
                <div className="p-0">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/40 text-xs uppercase text-slate-400">
                      <tr>
                        <th className="px-5 py-3 font-medium">Medicine</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {shop.medicines.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-200">{med.name}</td>
                          <td className="px-5 py-3">{getStockBadge(med.stock)}</td>
                          <td className="px-5 py-3 text-right text-emerald-400 font-semibold">₹{med.price}</td>
                        </tr>
                      ))}
                      {shop.medicines.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-5 py-4 text-center text-slate-500 italic">No matching medicines found in this shop.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            
            {filteredShops.length === 0 && (
              <div className="col-span-2 text-center py-20 glass rounded-xl">
                <span className="text-4xl mb-4 block">📦</span>
                <p className="text-slate-400 text-lg">No shops or medicines found matching "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
