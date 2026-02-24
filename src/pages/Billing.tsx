import { Check, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Monthly",
    price: "Rs 13,967 PKR",
    priceDetail: "(49.95 USD/mo)",
    interval: "Invoiced every month",
    popular: false,
  },
  {
    name: "Annually",
    price: "Rs 5,578 PKR",
    priceDetail: "(19.95 USD/mo)",
    interval: "Invoiced every year",
    popular: true,
    discount: "60%",
  },
  {
    name: "Quarterly",
    price: "Rs 8,374 PKR",
    priceDetail: "(29.95 USD/mo)",
    interval: "Invoiced each quarter",
    popular: false,
  },
];

const features = [
  "Create unlimited dynamic QR codes",
  "Access a variety of QR types",
  "Unlimited modifications of QR codes",
  "Unlimited scans",
  "Multiple QR code download formats",
  "Unlimited users",
  "Premium customer support",
  "Cancel at anytime",
];

export default function Billing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBuy = (plan: (typeof plans)[0]) => {
    setLoadingPlan(plan.name);
    setTimeout(() => {
      navigate("/checkout", { state: { plan } });
    }, 1200);
  };

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold">
          Plans <span className="text-primary italic">&</span> Pricing
        </h1>
        <p className="text-muted-foreground mt-2">
          Select the most convenient plan for you.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-card border rounded-2xl p-8 flex flex-col min-h-[600px] ${
              plan.popular ? "border-primary shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Crown className="w-4 h-4" /> Most Popular
                </div>
                {plan.discount && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {plan.discount}
                  </div>
                )}
              </>
            )}
            <h2 className="text-xl font-bold text-primary text-center mt-4">
              {plan.name}
            </h2>
            <div className="text-center mt-6">
              <span className="text-2xl font-bold">{plan.price}</span>{" "}
              <span className="text-sm text-muted-foreground">
                {plan.priceDetail}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {plan.interval}
            </p>
            <Button
              className="w-full mt-8"
              onClick={() => handleBuy(plan)}
              disabled={loadingPlan === plan.name}
            >
              {loadingPlan === plan.name ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Buy Now"
              )}
            </Button>
            <ul className="mt-8 space-y-4 flex-1">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}