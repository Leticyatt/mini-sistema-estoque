import { useState } from "react";
import { Product, CATEGORIES } from "./data";

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, "id"> & { id?: number }) => void;
  onCancel: () => void;
}

const EMPTY: Omit<Product, "id"> = {
  name: "",
  category: CATEGORIES[0],
  price: 0,
  quantity: 0,
  minStock: 5,
  description: "",
};

function FocusInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white transition-all ${className}`}
      onFocus={e => { e.target.style.borderColor = "#3CB371"; e.target.style.boxShadow = "0 0 0 3px rgba(60,179,113,0.12)"; }}
      onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
    />
  );
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const isEdit = !!product;
  const [form, setForm] = useState<Omit<Product, "id">>(
    product ? { name: product.name, category: product.category, price: product.price, quantity: product.quantity, minStock: product.minStock, description: product.description }
      : EMPTY
  );

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, ...(isEdit ? { id: product!.id } : {}) });
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-gray-900 font-bold text-xl">{isEdit ? "Editar Produto" : "Novo Produto"}</h2>
        <p className="text-gray-500 text-sm mt-0.5">{isEdit ? "Atualize as informações do produto." : "Preencha os dados do novo produto."}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Produto *</label>
            <FocusInput
              required
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="Ex: Notebook Dell i5"
            />
          </div>

          {/* Categoria + Preço */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria *</label>
              <select
                required
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white transition-all"
                onFocus={e => { e.target.style.borderColor = "#3CB371"; e.target.style.boxShadow = "0 0 0 3px rgba(60,179,113,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preço (R$) *</label>
              <FocusInput
                required
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={e => set("price", parseFloat(e.target.value) || 0)}
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Quantidade + Estoque Mínimo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantidade Atual *</label>
              <FocusInput
                required
                type="number"
                min={0}
                value={form.quantity}
                onChange={e => set("quantity", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Estoque Mínimo *</label>
              <FocusInput
                required
                type="number"
                min={0}
                value={form.minStock}
                onChange={e => set("minStock", parseInt(e.target.value) || 0)}
                placeholder="5"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={3}
              placeholder="Descreva o produto..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white resize-none transition-all"
              onFocus={e => { e.target.style.borderColor = "#3CB371"; e.target.style.boxShadow = "0 0 0 3px rgba(60,179,113,0.12)"; }}
              onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: "#2E8B57", color: "#2E8B57" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "#2E8B57" }}
            >
              {isEdit ? "Salvar Alterações" : "Salvar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
