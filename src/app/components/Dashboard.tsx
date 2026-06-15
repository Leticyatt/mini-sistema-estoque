import { Package, DollarSign, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Product, getStatus } from "./data";

interface DashboardProps {
  products: Product[];
}

export function Dashboard({ products }: DashboardProps) {
  const total = products.length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const lowStock = products.filter(p => {
    const s = getStatus(p);
    return s === "Baixo" || s === "Zerado";
  }).length;

  const top5 = [...products]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(p => ({ name: p.name.length > 20 ? p.name.slice(0, 18) + "…" : p.name, quantidade: p.quantity }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-gray-900 font-bold text-xl">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-0.5">Visão geral do seu estoque</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Produtos */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0faf5" }}>
            <Package size={22} style={{ color: "#3CB371" }} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Total de Produtos</p>
            <p className="text-gray-900 font-bold text-2xl mt-0.5">{total}</p>
          </div>
        </div>

        {/* Valor em Estoque */}
        <div className="rounded-xl border shadow-sm p-5 flex items-center gap-4" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#dcfce7" }}>
            <DollarSign size={22} style={{ color: "#2E8B57" }} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide" style={{ color: "#166534" }}>Valor em Estoque</p>
            <p className="font-bold text-2xl mt-0.5" style={{ color: "#14532d" }}>
              {totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>
        </div>

        {/* Estoque Baixo */}
        <div className="bg-amber-50 rounded-xl border border-amber-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-amber-700 text-xs uppercase tracking-wide">Estoque Baixo/Zerado</p>
            <p className="text-amber-900 font-bold text-2xl mt-0.5">{lowStock}</p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-gray-800 font-semibold text-sm mb-4">Top 5 Produtos com Maior Estoque</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={top5} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              cursor={{ fill: "rgba(143,188,143,0.1)" }}
            />
            <Bar dataKey="quantidade" fill="#3CB371" radius={[6, 6, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent table summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-gray-800 font-semibold text-sm">Produtos Recentes</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {products.slice(0, 5).map(p => {
            const status = getStatus(p);
            return (
              <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-gray-800 text-sm font-medium">{p.name}</p>
                  <p className="text-gray-400 text-xs">{p.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 text-sm">{p.quantity} un.</span>
                  <StatusBadge status={status} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "Normal" | "Baixo" | "Zerado" }) {
  if (status === "Normal")
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#98FB98", color: "#166534" }}>Normal</span>;
  if (status === "Baixo")
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Baixo</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Zerado</span>;
}
