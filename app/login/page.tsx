"use client";
import SectionTitle from "@/components/SectionTitle";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaGaugeHigh, FaLock, FaRegUser } from "react-icons/fa6";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    const expired = searchParams.get("expired");
    if (expired === "true") {
      setError("La sessione è scaduta. Effettua nuovamente l'accesso.");
      toast.error("Sessione scaduta. Accedi nuovamente.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    if (!isValidEmailAddressFormat(loginEmail)) {
      setError("Formato email non valido");
      toast.error("Formato email non valido");
      return;
    }
    if (!loginPass || loginPass.length < 8) {
      setError("La password deve avere almeno 8 caratteri");
      toast.error("Password non valida");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPass,
      });

      if (res?.error) {
        setError("Credenziali non valide. Riprova.");
        toast.error("Email o password errati");
      } else {
        toast.success("Accesso effettuato con successo!");
        if (loginEmail === "admin@kronovolt.com") {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
      }
    } catch {
      setError("Errore di connessione durante il login.");
      toast.error("Errore durante il login");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Bentornato su KronoVolt
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Accedi con le tue credenziali o usa l&apos;accesso rapido demo
          </p>
        </div>

        {/* 1-Click Demo Login Buttons */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Accesso Rapido Demo (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEmail("admin@kronovolt.com");
                setPassword("Admin1234!");
                performLogin("admin@kronovolt.com", "Admin1234!");
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-blue-600 text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <FaGaugeHigh />
              <span>Demo Admin</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEmail("demo@kronovolt.com");
                setPassword("Demo1234!");
                performLogin("demo@kronovolt.com", "Demo1234!");
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FaRegUser />
              <span>Demo Cliente</span>
            </button>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Indirizzo Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kronovolt.com"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
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
            <FaLock className="text-xs" />
            <span>{loading ? "Accesso in corso..." : "Accedi"}</span>
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Non hai ancora un account?{" "}
          <Link
            href="/register"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Registrati ora
          </Link>
        </p>
      </div>
    </div>
  );
}

const LoginPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SectionTitle
        title="Accedi al Tuo Account"
        path="Home / Area Utente / Login"
      />
      <Suspense
        fallback={
          <div className="max-w-md mx-auto px-4 pt-12 text-center text-sm text-slate-500">
            Caricamento modulo di accesso...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
};

export default LoginPage;
