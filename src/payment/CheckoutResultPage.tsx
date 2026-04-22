import { useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";

const ACCOUNT_PAGE_REDIRECT_DELAY_MS = 4000;

export default function CheckoutResultPage() {
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const status = urlSearchParams.get("status");

  useEffect(() => {
    const dashboardRedirectTimeoutId = setTimeout(() => {
      navigate("/home");
    }, ACCOUNT_PAGE_REDIRECT_DELAY_MS);

    return () => {
      clearTimeout(dashboardRedirectTimeoutId);
    };
  }, []);

  if (status !== "success" && status !== "canceled") {
    return <Navigate to="/home" />;
  }

  return (
    <div className="mt-10 flex flex-col items-stretch sm:mx-6 sm:items-center">
      <div className="flex flex-col gap-4 px-4 py-8 text-center shadow-xl ring-1 ring-gray-900/10 sm:max-w-md sm:rounded-lg sm:px-10 dark:ring-gray-100/10">
        <h1 className="text-xl font-semibold">
          {status === "success" && "🥳 Sikeres fizetés!"}
          {status === "canceled" && "😢 Fizetés megszakítva."}
        </h1>
        <span className="">
          Visszairányítunk az irányítópultra{" "}
          {ACCOUNT_PAGE_REDIRECT_DELAY_MS / 1000} másodpercen belül...
        </span>
      </div>
    </div>
  );
}
