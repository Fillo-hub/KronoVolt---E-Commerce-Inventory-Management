import SectionTitle from "@/components/SectionTitle";
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";

const CartPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SectionTitle
        title="Il Tuo Carrello"
        path="Home / Carrello Acquisti"
      />
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10 pt-6">
        <Suspense fallback={<Loader />}>
          <CartModule />
        </Suspense>
      </div>
    </div>
  );
};

export default CartPage;
