import { useState } from "react";
import { Search, Plus, Download, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Product, getStatus, ProductStatus } from "./data";

interface ProductListProps {
  products: Product[];
  onNew: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const PAGE_SIZE = 6;

function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === "Normal")
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#98FB98", color: "#166534" }}>Normal</span>;
  if (status === "Baixo")
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Baixo</span>;
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Zerado</span>;
}

export function ProductList({ products, onNew, onEdit, onDelete }: ProductListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ProductStatus>("");
  const [page, setPage] = useState(1);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "" || getStatus(p) === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(v: string) { setSearch(v); setPage(1); }
  function handleFilter(v: string) { setStatusFilter(v as "" | ProductStatus); setPage(1); }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 font-bold text-xl">Produtos</h2>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} produto(s) encontrado(s)</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Buscar produto ou categoria..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white focus:border-[#3CB371]"
            style={{ transition: "border-color 0.15s" }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => handleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none text-gray-700 focus:border-[#3CB371]"
        >
          <option value="">Todos os status</option>
          <option value="Normal">Normal</option>
          <option value="Baixo">Baixo</option>
          <option value="Zerado">Zerado</option>
        </select>

        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#2E8B57" }}
        >
          <Plus size={15} />
          Novo Produto
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(143,188,143,0.12)" }}>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide">Nome</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide">Categoria</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 text-xs uppercase tracking-wide">Preço</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 text-xs uppercase tracking-wide">Quantidade</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 text-xs uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">Nenhum produto encontrado.</td>
                </tr>
              ) : paged.map(p => {
                const status = getStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{p.quantity}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#2E8B57] hover:bg-green-50 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => onDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-colors"
                  style={
                    n === page
                      ? { backgroundColor: "#3CB371", color: "#fff" }
                      : { color: "#6b7280" }
                  }
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
