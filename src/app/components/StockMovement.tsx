import { useState } from "react";
import { Search, ArrowDownCircle, ArrowUpCircle, CheckCircle } from "lucide-react";
import { Product } from "./data";

interface StockMovementProps {
  products: Product[];
  preselected?: Product | null;
  onConfirm: (productId: number, type: "Entrada" | "Saída", quantity: number, observation: string) => void;
}

export function StockMovement({ products, preselected, onConfirm }: StockMovementProps) {
  const [search, setSearch] = useState(preselected ? preselected.name : "");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(preselected || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [type, setType] = useState<"Entrada" | "Saída">("Entrada");
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");
  const [success, setSuccess] = useState(false);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6);

  function selectProduct(p: Product) {
    setSelectedProduct(p);
    setSearch(p.name);
    setShowDropdown(false);
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;
    onConfirm(selectedProduct.id, type, quantity, observation);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedProduct(null);
      setSearch("");
      setQuantity(1);
      setObservation("");
      setType("Entrada");
    }, 2000);
  }

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-6">
        <h2 className="text-gray-900 font-bold text-xl">Movimentação de Estoque</h2>
        <p className="text-gray-500 text-sm mt-0.5">Registre entradas e saídas de produtos</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <form onSubmit={handleConfirm} className="p-6 space-y-5">
          {/* Product Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Produto *</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedProduct(null); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Busque o produto..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white transition-all"
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onKeyDown={e => { if (e.key === "Escape") setShowDropdown(false); }}
                style={{ borderColor: showDropdown ? "#3CB371" : undefined }}
              />
              {showDropdown && filtered.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg border border-gray-200 shadow-lg z-20 overflow-hidden">
                  {filtered.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                      onMouseDown={() => selectProduct(p)}
                    >
                      <span className="text-sm text-gray-800">{p.name}</span>
                      <span className="text-xs text-gray-400">{p.quantity} un.</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedProduct && (
              <p className="text-xs mt-1.5" style={{ color: "#3CB371" }}>
                Estoque atual: <strong>{selectedProduct.quantity}</strong> unidades · Mínimo: {selectedProduct.minStock}
              </p>
            )}
          </div>

          {/* Type toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Movimentação *</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("Entrada")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all"
                style={type === "Entrada"
                  ? { backgroundColor: "#98FB98", borderColor: "#3CB371", color: "#14532d" }
                  : { backgroundColor: "#f9fafb", borderColor: "#e5e7eb", color: "#6b7280" }}
              >
                <ArrowDownCircle size={16} />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType("Saída")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all"
                style={type === "Saída"
                  ? { backgroundColor: "#f3f4f6", borderColor: "#9ca3af", color: "#374151" }
                  : { backgroundColor: "#f9fafb", borderColor: "#e5e7eb", color: "#6b7280" }}
              >
                <ArrowUpCircle size={16} />
                Saída
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantidade *</label>
            <input
              required
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white transition-all"
              onFocus={e => { e.target.style.borderColor = "#3CB371"; e.target.style.boxShadow = "0 0 0 3px rgba(60,179,113,0.12)"; }}
              onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Observation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Observação / Motivo</label>
            <textarea
              value={observation}
              onChange={e => setObservation(e.target.value)}
              rows={3}
              placeholder="Ex: Recebimento NF-1234, venda balcão..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white resize-none transition-all"
              onFocus={e => { e.target.style.borderColor = "#3CB371"; e.target.style.boxShadow = "0 0 0 3px rgba(60,179,113,0.12)"; }}
              onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedProduct || success}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: success ? "#3CB371" : "#2E8B57" }}
          >
            {success ? (
              <><CheckCircle size={16} /> Movimentação confirmada!</>
            ) : (
              "Confirmar Movimentação"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
