import { useState } from "react";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    });

    if (error) {
      setError("Erro ao enviar e-mail. Verifique se o endereço está correto.");
    } else {
      setMessage("Link de recuperação enviado! Verifique sua caixa de entrada.");
      setEmail("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Decorative blobs */}
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
            <h1 className="text-gray-900 font-bold text-xl">Recuperar Senha</h1>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">{error}</div>}
          {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm text-center border border-green-200">{message}</div>}

          <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">
            Digite o e-mail atrelado à sua conta e enviaremos um link para você redefinir a sua senha.
          </p>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 mt-2"
              style={{ backgroundColor: "#2E8B57" }}
            >
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-semibold hover:underline" style={{ color: "#3CB371" }}>
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}