import { AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { Product, getStatus } from "./data";

interface StockAlertsProps {
  products: Product[];
  onRestock: (product: Product) => void;
}

export function StockAlerts({ products, onRestock }: StockAlertsProps) {
  const zeroed = products.filter(p => getStatus(p) === "Zerado");
  const low = products.filter(p => getStatus(p) === "Baixo");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-gray-900 font-bold text-xl">Alertas de Estoque</h2>
        <p className="text-gray-500 text-sm mt-0.5">Produtos que precisam de atenção imediata</p>
      </div>

      {/* Urgente — Zerado */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <XCircle size={18} className="text-red-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Urgente — Estoque Zerado</h3>
          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">{zeroed.length}</span>
        </div>
        {zeroed.length === 0 ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-6 text-center text-sm text-red-400">
            Nenhum produto com estoque zerado.
          </div>
        ) : (
          <div className="space-y-2">
            {zeroed.map(p => (
              <div key={p.id} className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-red-900 font-semibold text-sm truncate">{p.name}</p>
                  <p className="text-red-500 text-xs mt-0.5">{p.category} · Estoque mínimo: {p.minStock}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p className="text-red-600 font-bold text-lg leading-none">0</p>
                    <p className="text-red-400 text-xs mt-0.5">unidades</p>
                  </div>
                  <button
                    onClick={() => onRestock(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: "#2E8B57" }}
                  >
                    <RefreshCw size={12} />
                    Repor Estoque
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Atenção — Baixo */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-amber-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Atenção — Estoque Baixo</h3>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{low.length}</span>
        </div>
        {low.length === 0 ? (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-6 text-center text-sm text-amber-400">
            Nenhum produto com estoque baixo.
          </div>
        ) : (
          <div className="space-y-2">
            {low.map(p => (
              <div key={p.id} className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-amber-900 font-semibold text-sm truncate">{p.name}</p>
                  <p className="text-amber-500 text-xs mt-0.5">{p.category} · Estoque mínimo: {p.minStock}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p className="text-amber-700 font-bold text-lg leading-none">{p.quantity}</p>
                    <p className="text-amber-400 text-xs mt-0.5">unidades</p>
                  </div>
                  <button
                    onClick={() => onRestock(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: "#2E8B57" }}
                  >
                    <RefreshCw size={12} />
                    Repor Estoque
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
