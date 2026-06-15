import { LayoutDashboard, Package, AlertTriangle, ArrowLeftRight, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

type Screen = "dashboard" | "products" | "product-form" | "alerts" | "movement";

interface SidebarProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard" as Screen, label: "Dashboard", icon: LayoutDashboard },
  { id: "products" as Screen, label: "Produtos", icon: Package },
  { id: "alerts" as Screen, label: "Alertas de Estoque", icon: AlertTriangle },
  { id: "movement" as Screen, label: "Movimentação", icon: ArrowLeftRight },
];

export function Sidebar({ current, onNavigate, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="px-6 py-5 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">StockAdmin</p>
            <p className="text-white/60 text-xs mt-0.5">Sistema de Estoque</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = current === id || (current === "product-form" && id === "products");
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={18} />
          Sair do sistema
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen shrink-0" style={{ backgroundColor: "#2E8B57" }}>
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 shadow" style={{ backgroundColor: "#2E8B57" }}>
        <div className="flex items-center gap-2">
          <Package size={20} className="text-white" />
          <span className="text-white font-semibold text-sm">StockAdmin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside
            className="absolute top-0 left-0 w-60 h-full flex flex-col"
            style={{ backgroundColor: "#2E8B57" }}
            onClick={e => e.stopPropagation()}
          >
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
