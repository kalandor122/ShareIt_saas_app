import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "wasp/client/auth";
import {
  generateCheckoutSession,
  getCustomerPortalUrl,
  useQuery,
} from "wasp/client/operations";
import {
  PaymentPlanId,
  prettyPaymentPlanName,
  SubscriptionStatus,
} from "./plans";
import './NewPricingPage.css';

const bestDealPaymentPlanId: PaymentPlanId = PaymentPlanId.Medium;

interface PaymentPlanCard {
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const paymentPlanCards: Record<PaymentPlanId, PaymentPlanCard> = {
  [PaymentPlanId.Small]: {
    name: prettyPaymentPlanName(PaymentPlanId.Small),
    price: "1000Ft",
    description: "Alap csomag",
    features: ["Bárhol felhasználható", "Azonnali aktiválás"],
  },
  [PaymentPlanId.Medium]: {
    name: prettyPaymentPlanName(PaymentPlanId.Medium),
    price: "5000Ft",
    description: "Legnépszerűbb",
    features: ["Bárhol felhasználható", "Azonnali aktiválás", "Priority support"],
  },
  [PaymentPlanId.Large]: {
    name: prettyPaymentPlanName(PaymentPlanId.Large),
    price: "10 000Ft",
    description: "Pro csomag",
    features: ["Bárhol felhasználható", "Azonnali aktiválás", "Priority support", "Extra sávszélesség"],
  },
};

const NewPricingPage = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: user } = useAuth();
  const isUserSubscribed =
    !!user &&
    !!user.subscriptionStatus &&
    user.subscriptionStatus !== SubscriptionStatus.Deleted;

  const {
    data: customerPortalUrl,
    isLoading: isCustomerPortalUrlLoading,
    error: customerPortalUrlError,
  } = useQuery(getCustomerPortalUrl, { enabled: isUserSubscribed });

  const navigate = useNavigate();

  async function handleBuyNowClick(paymentPlanId: PaymentPlanId) {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setIsPaymentLoading(true);
      const checkoutResults = await generateCheckoutSession(paymentPlanId);
      if (checkoutResults?.sessionUrl) {
        window.open(checkoutResults.sessionUrl, "_self");
      } else {
        throw new Error("Error generating checkout session URL");
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Hiba történt a fizetés során. Kérjük próbálja újra később.");
      }
      setIsPaymentLoading(false);
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (customerPortalUrlError) {
      setErrorMessage("Error fetching Customer Portal URL");
      return;
    }
    if (!customerPortalUrl) {
      setErrorMessage(`Customer Portal does not exist for user ${user.id}`);
      return;
    }
    window.open(customerPortalUrl, "_blank");
  };

  return (
    <div className="pricing-page">
      <div className="orb of oa" style={{ width: '450px', height: '450px', background: 'var(--coral)', top: '-150px', right: '-100px' }}></div>
      <div className="orb of ob" style={{ width: '350px', height: '350px', background: 'var(--sky)', bottom: '-100px', left: '-100px' }}></div>
      <div className="orb os oc" style={{ width: '250px', height: '250px', borderColor: 'var(--mint)', top: '25%', left: '5%' }}></div>

      <div className="pricing-inner">
        <header className="pricing-header">
          <div className="pricing-eyebrow">ShareNet · Csomagok</div>
          <h1 className="pricing-title">
            Válassz <span className="lime">csomagot!</span>
          </h1>
          <p className="pricing-sub">
            Nincs elköteleződés, nincs havidíj. Csak annyit fizetsz, amennyit használsz.
          </p>
        </header>

        {errorMessage && (
          <div className="error-alert">
            {errorMessage}
          </div>
        )}

        <div className="pricing-grid">
          {Object.values(PaymentPlanId).map((planId) => (
            <div 
              key={planId} 
              className={`pricing-card ${planId === bestDealPaymentPlanId ? 'best-deal' : ''}`}
            >
              {planId === bestDealPaymentPlanId && (
                <div className="deal-badge">Legjobb ajánlat</div>
              )}
              
              <div className="card-header">
                <div className="plan-name">{paymentPlanCards[planId].name}</div>
                <div className="plan-price">{paymentPlanCards[planId].price}</div>
              </div>

              <ul className="features-list">
                {paymentPlanCards[planId].features.map((feature) => (
                  <li key={feature} className="feature-item">
                    <CheckCircle className="feature-icon" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="card-footer">
                {isUserSubscribed ? (
                  <button
                    onClick={handleCustomerPortalClick}
                    disabled={isCustomerPortalUrlLoading}
                    className="btn-pricing primary"
                  >
                    Előfizetés kezelése
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyNowClick(planId)}
                    disabled={isPaymentLoading}
                    className={`btn-pricing ${planId === bestDealPaymentPlanId ? 'primary' : 'outline'}`}
                  >
                    {!!user ? "Vásárlás most" : "Jelentkezz be a vásárláshoz"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewPricingPage;
