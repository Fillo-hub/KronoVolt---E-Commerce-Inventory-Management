"use client";
import SectionTitle from "@/components/SectionTitle";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa6";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (em: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(em);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Inserisci un indirizzo email valido");
      toast.error("Indirizzo email non valido");
      return;
    }

    if (!password || password.length < 8) {
      setError("La password deve contenere almeno 8 caratteri");
      toast.error("Password troppo corta (min 8 caratteri)");
      return;
    }

    if (confirmPassword !== password) {
      setError("Le password non coincidono");
      toast.error("Le password non coincidono");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        toast.success("Registrazione completata! Ora puoi accedere.");
        router.push("/login");
      } else {
        if (data.details && Array.isArray(data.details)) {
          const errorMessage = data.details
            .map((err: any) => err.message)
            .join(", ");
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Registrazione non riuscita");
          toast.error("Registrazione non riuscita");
        }
      }
    } catch {
      toast.error("Errore di rete, riprova");
      setError("Errore di rete, riprova");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SectionTitle
        title="Crea un Nuovo Account"
        path="Home / Area Utente / Registrazione"
      />

      <div className="max-w-md mx-auto px-4 pt-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Unisciti a KronoVolt
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Crea il tuo profilo per salvare ordini, ricevute e liste desideri
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marco"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Cognome
                </label>
                <input
                  type="text"
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Rossi"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Indirizzo Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@esempio.it"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password (min. 8 caratteri)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Conferma Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FaUserPlus className="text-xs" />
              <span>{loading ? "Registrazione..." : "Crea Account"}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Hai già un account?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
