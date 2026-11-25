"use client";
import SectionTitle from "@/components/SectionTitle";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { FaBolt, FaLock, FaWandMagicSparkles } from "react-icons/fa6";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    company: "",
    adress: "",
    apartment: "",
    city: "",
    country: "Italia",
    postalCode: "",
    orderNotice: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  const fillDemoCustomer = () => {
    setCheckoutForm({
      name: "Marco",
      lastname: "Rossi",
      phone: "3401234567",
      email: session?.user?.email || "demo@kronovolt.com",
      company: "Rossi Digital Studio",
      adress: "Via Torino 45",
      apartment: "Interno 4B",
      city: "Milano",
      country: "Italia",
      postalCode: "20123",
      orderNotice: "Consegna preferibilmente in mattinata.",
    });
    toast.success("Dati demo compilati automaticamente!");
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!checkoutForm.name.trim() || checkoutForm.name.trim().length < 2)
      errors.push("Il nome deve contenere almeno 2 caratteri");
    if (!checkoutForm.lastname.trim() || checkoutForm.lastname.trim().length < 2)
      errors.push("Il cognome deve contenere almeno 2 caratteri");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!checkoutForm.email.trim() || !emailRegex.test(checkoutForm.email.trim()))
      errors.push("Inserisci un indirizzo email valido");
    const phoneDigits = checkoutForm.phone.replace(/[^0-9]/g, "");
    if (!checkoutForm.phone.trim() || phoneDigits.length < 10)
      errors.push("Il telefono deve contenere almeno 10 cifre");
    if (!checkoutForm.company.trim() || checkoutForm.company.trim().length < 5)
      errors.push("Azienda / Riferimento deve avere almeno 5 caratteri");
    if (!checkoutForm.adress.trim() || checkoutForm.adress.trim().length < 5)
      errors.push("L'indirizzo deve avere almeno 5 caratteri");
    if (!checkoutForm.apartment.trim())
      errors.push("Interno / Scala è obbligatorio");
    if (!checkoutForm.city.trim() || checkoutForm.city.trim().length < 5)
      errors.push("La città deve avere almeno 5 caratteri (es. Milano)");
    if (!checkoutForm.country.trim() || checkoutForm.country.trim().length < 5)
      errors.push("La nazione deve avere almeno 5 caratteri (es. Italia)");
    if (!checkoutForm.postalCode.trim() || checkoutForm.postalCode.trim().length < 3)
      errors.push("Il CAP deve avere almeno 3 caratteri");
    return errors;
  };

  const shippingCost = total === 0 || total >= 99 ? 0 : 5;
  const finalTotal = total === 0 ? 0 : total + shippingCost;

  const makePurchase = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    if (products.length === 0) {
      toast.error("Il carrello è vuoto");
      return;
    }

    setIsSubmitting(true);

    try {
      let userId = null;
      if (session?.user?.email) {
        try {
          const userResponse = await apiClient.get(
            `/api/users/email/${session.user.email}`
          );
          if (userResponse.ok) {
            const userData = await userResponse.json();
            userId = userData.id;
          }
        } catch {}
      }

      const orderData = {
        name: checkoutForm.name.trim(),
        lastname: checkoutForm.lastname.trim(),
        phone: checkoutForm.phone.trim(),
        email: checkoutForm.email.trim().toLowerCase(),
        company: checkoutForm.company.trim(),
        adress: checkoutForm.adress.trim(),
        apartment: checkoutForm.apartment.trim(),
        postalCode: checkoutForm.postalCode.trim(),
        status: "processing",
        total: finalTotal,
        city: checkoutForm.city.trim(),
        country: checkoutForm.country.trim(),
        orderNotice: checkoutForm.orderNotice.trim(),
        userId,
      };

      const response = await apiClient.post("/api/orders", orderData);

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.details && Array.isArray(errorData.details)) {
            errorData.details.forEach((detail: any) =>
              toast.error(`${detail.field}: ${detail.message}`)
            );
          } else {
            toast.error(errorData.details || errorData.error || "Errore ordine");
          }
        } catch {
          toast.error("Impossibile completare l'ordine.");
        }
        return;
      }

      const data = await response.json();
      const orderId: string = data.id;

      await Promise.all(
        products.map((p) =>
          apiClient.post("/api/order-product", {
            customerOrderId: orderId,
            productId: p.id,
            quantity: p.amount,
          })
        )
      );

      try {
        const saved = JSON.parse(
          localStorage.getItem("kronovolt-recent-orders") || "[]"
        );
        localStorage.setItem(
          "kronovolt-recent-orders",
          JSON.stringify([orderId, ...saved].slice(0, 10))
        );
        window.dispatchEvent(new CustomEvent("orderCompleted"));
      } catch {}

      clearCart();
      toast.success(`Ordine #${orderId.slice(0, 8)} confermato!`);
      router.push(`/orders?id=${encodeURIComponent(orderId)}`);
    } catch {
      toast.error("Si è verificato un errore durante l'invio dell'ordine.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (products.length === 0 && !isSubmitting) {
      router.push("/cart");
    }
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SectionTitle
        title="Checkout & Spedizione"
        path="Home / Carrello / Checkout"
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Left */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Dati di Fatturazione e Consegna
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compila i campi richiesti oppure usa l&apos;autocompilazione rapida
                per testare un ordine.
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
            >
              <FaWandMagicSparkles />
              <span>Autocompila Dati Demo</span>
            </button>
          </div>

          <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nome *
                </label>
                <input
                  type="text"
                  value={checkoutForm.name}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, name: e.target.value })
                  }
                  placeholder="Marco"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Cognome *
                </label>
                <input
                  type="text"
                  value={checkoutForm.lastname}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      lastname: e.target.value,
                    })
                  }
                  placeholder="Rossi"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, email: e.target.value })
                  }
                  placeholder="marco.rossi@email.it"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Telefono (min 10 cifre) *
                </label>
                <input
                  type="tel"
                  value={checkoutForm.phone}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                  }
                  placeholder="3401234567"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Azienda / Riferimento Citofono (min 5 caratteri) *
              </label>
              <input
                type="text"
                value={checkoutForm.company}
                onChange={(e) =>
                  setCheckoutForm({ ...checkoutForm, company: e.target.value })
                }
                placeholder="Rossi Digital Studio / Famiglia Rossi"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Via e Numero Civico *
                </label>
                <input
                  type="text"
                  value={checkoutForm.adress}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, adress: e.target.value })
                  }
                  placeholder="Via Torino 45"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Interno / Scala *
                </label>
                <input
                  type="text"
                  value={checkoutForm.apartment}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      apartment: e.target.value,
                    })
                  }
                  placeholder="Scala B, Int. 4"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Città (min 5 car.) *
                </label>
                <input
                  type="text"
                  value={checkoutForm.city}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, city: e.target.value })
                  }
                  placeholder="Milano"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  CAP *
                </label>
                <input
                  type="text"
                  value={checkoutForm.postalCode}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      postalCode: e.target.value,
                    })
                  }
                  placeholder="20123"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nazione *
                </label>
                <input
                  type="text"
                  value={checkoutForm.country}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      country: e.target.value,
                    })
                  }
                  placeholder="Italia"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Note per la consegna (opzionale)
              </label>
              <textarea
                rows={3}
                value={checkoutForm.orderNotice}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    orderNotice: e.target.value,
                  })
                }
                placeholder="Orari preferiti o indicazioni per il corriere..."
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={makePurchase}
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <FaLock className="text-xs" />
              <span>
                {isSubmitting
                  ? "Registrazione Ordine in corso..."
                  : `Conferma Ordine (€${finalTotal})`}
              </span>
            </button>
          </form>
        </div>

        {/* Order Summary Right */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs sticky top-28">
            <h2 className="text-lg font-extrabold text-slate-900">
              Riepilogo Articoli ({products.length})
            </h2>

            <ul className="mt-4 divide-y divide-slate-100">
              {products.map((product) => (
                <li
                  key={product?.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        product?.image
                          ? `/${product?.image}`
                          : "/product_placeholder.jpg"
                      }
                      alt={product?.title}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-xl bg-slate-50 p-1 object-contain border border-slate-100"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {product?.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Quantità: x{product?.amount}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-slate-900">
                    €{product?.price * product?.amount}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-600">Subtotale</dt>
                <dd className="font-bold text-slate-900">€{total}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-600">Spedizione Express</dt>
                <dd className="font-bold text-emerald-700">
                  {shippingCost === 0 ? "Gratuita" : `€${shippingCost}`}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <dt className="text-base font-extrabold text-slate-900">
                  Totale da Pagare
                </dt>
                <dd className="text-2xl font-black text-blue-600">
                  €{finalTotal}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
