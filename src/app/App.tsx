import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Importações necessárias
import { supabase } from "./supabase";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import UpdatePassword from "./components/UpdatePassword";

import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ProductList } from "./components/ProductList";
import { ProductForm } from "./components/ProductForm";
import { StockAlerts } from "./components/StockAlerts";
import { StockMovement } from "./components/StockMovement";
import { Product } from "./components/data"; 

type Screen = "dashboard" | "products" | "product-form" | "alerts" | "movement";

export default function App() {
  const [session, setSession] = useState<any>(null); 
  const [screen, setScreen] = useState<Screen>("dashboard");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function carregarProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Erro ao buscar dados:', error);
    } else if (data) {
      setProducts(data as Product[]);
    }
  }

  useEffect(() => {
    if (session) {
      carregarProdutos();
    } else {
      setProducts([]); 
    }
  }, [session]);

  function handleNavigate(s: Screen) {
    setScreen(s);
    setEditingProduct(null);
    setRestockProduct(null);
  }

  function handleNew() {
    setEditingProduct(null);
    setScreen("product-form");
  }

  function handleEdit(p: Product) {
    setEditingProduct(p);
    setScreen("product-form");
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from('produtos').delete().eq('id', id);
    if (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao excluir o produto do banco.");
      return;
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  async function handleSave(data: Omit<Product, "id"> & { id?: number }) {
    if (data.id != null) {
      const { error } = await supabase.from('produtos').update(data).eq('id', data.id);
      if (!error) {
        setProducts(prev => prev.map(p => p.id === data.id ? { ...data, id: data.id! } : p));
      } else {
        console.error("Erro ao atualizar:", error);
      }
    } else {
      const { data: newProduct, error } = await supabase.from('produtos').insert([data]).select().single();
      if (!error && newProduct) {
        setProducts(prev => [...prev, newProduct as Product]);
      } else {
        console.error("Erro ao salvar novo produto:", error);
      }
    }
    setScreen("products");
    setEditingProduct(null);
  }

  function handleRestock(product: Product) {
    setRestockProduct(product);
    setScreen("movement");
  }

  async function handleMovement(productId: number, type: "Entrada" | "Saída", qty: number) {
    const produtoAtual = products.find(p => p.id === productId);
    if (!produtoAtual) return;

    const novaQuantidade = Math.max(0, (produtoAtual as any).quantity + (type === "Entrada" ? qty : -qty));

    const { error } = await supabase.from('produtos').update({ quantity: novaQuantidade }).eq('id', productId);

    if (!error) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, quantity: novaQuantidade } : p));
    } else {
      console.error("Erro ao movimentar estoque:", error);
    }
    setRestockProduct(null);
  }

  const dashboardContent = (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <Sidebar
        current={screen}
        onNavigate={handleNavigate}
        onLogout={() => supabase.auth.signOut()}
      />

      <main className="flex-1 min-h-screen md:pt-0 pt-14 overflow-auto">
        {screen === "dashboard" && <Dashboard products={products} />}
        {screen === "products" && <ProductList products={products} onNew={handleNew} onEdit={handleEdit} onDelete={handleDelete} />}
        {screen === "product-form" && <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setScreen("products")} />}
        {screen === "alerts" && <StockAlerts products={products} onRestock={handleRestock} />}
        {screen === "movement" && <StockMovement products={products} preselected={restockProduct} onConfirm={handleMovement} />}
      </main>
    </div>
  );

  return (
    <Router>
      <Routes>
        {}
        {}
        <Route path="/" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/atualizar-senha" element={<UpdatePassword />} />

        {}
        {}
        <Route 
          path="/dashboard" 
          element={session ? dashboardContent : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}