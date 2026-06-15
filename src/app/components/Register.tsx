import { useState } from "react";
import { Package, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError("Erro ao criar conta. Verifique os dados.");
    } else {
      setMessage("Cadastro realizado com sucesso! Faça login.");
      setTimeout(() => navigate("/"), 2000); 
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#F9FAFB" }}>
      {}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30" style={{ backgroundColor: "#98FB98" }} />
        <div className="absolute top-1/4 -right-24 w-72 h-72 rounded-full opacity-20" style={{ backgroundColor: "#8FBC8F" }} />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full opacity-25" style={{ backgroundColor: "#98FB98" }} />
        <div className="absolute bottom-1/3 -right-16 w-56 h-56 rounded-full opacity-15" style={{ backgroundColor: "#3CB371" }} />
        <svg className="absolute top-16 right-1/4 opacity-10" width="120" height="120" viewBox="0 0 120 120">
          <polygon points="60,5 115,95 5,95" fill="#2E8B57" />
        </svg>
        <svg className="absolute bottom-24 left-1/3 opacity-10" width="80" height="80" viewBox="0 0 80 80">
          <rect x="10" y="10" width="60" height="60" rx="8" fill="#3CB371" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #2E8B57, #3CB371, #8FBC8F)" }} />

        <div className="px-8 py-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: "#2E8B57" }}>
              <Package size={28} className="text-white" />
            </div>
            <h1 className="text-gray-900 font-bold text-xl">Criar Conta</h1>
            <p className="text-gray-500 text-sm mt-0.5">Controle de Estoque</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">{error}</div>}
          {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm text-center border border-green-200">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none transition-all bg-gray-50 focus:bg-white"
                onFocus={e => { e.target.style.borderColor = "#3CB371"; e.target.style.boxShadow = "0 0 0 3px rgba(60,179,113,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2.5 pr-11 rounded-lg border border-gray-200 text-sm outline-none transition-all bg-gray-50 focus:bg-white"
                  onFocus={e => { e.target.style.borderColor = "#3CB371"; e.target.style.boxShadow = "0 0 0 3px rgba(60,179,113,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Senha</label>
              <input
                type={showPass ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none transition-all bg-gray-50 focus:bg-white"
                onFocus={e => { e.target.style.borderColor = "#3CB371"; e.target.style.boxShadow = "0 0 0 3px rgba(60,179,113,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 mt-2"
              style={{ backgroundColor: "#2E8B57" }}
            >
              {loading ? "Criando..." : "Finalizar Cadastro"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link to="/" className="font-semibold hover:underline" style={{ color: "#3CB371" }}>
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}