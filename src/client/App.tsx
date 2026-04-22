import { useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { routes } from "wasp/client/router";
import { Toaster } from "../client/components/ui/toaster";
import "./Main.css";
import NavBar from "./components/NavBar/NavBar";
import { marketingNavigationItems } from "./components/NavBar/constants";
import CookieConsentBanner from "./components/cookie-consent/Banner";

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();

  const shouldDisplayAppNavBar = useMemo(() => {
    return (
      location.pathname !== "/" &&
      location.pathname !== routes.LoginRoute.build() &&
      location.pathname !== routes.SignupRoute.build()
    );
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fas = params.get('fas');
    const tok = params.get('tok');
    
    // If we see OpenNDS parameters, store them immediately
    if (fas || tok) {
      const openNdsParams = {
        fas: fas || undefined,
        token: tok || undefined,
        gatewayAddress: params.get('gatewayaddress') || params.get('gatewayname') || undefined,
        gatewayPort: params.get('gatewayport') || undefined,
        authDir: params.get('authdir') || undefined,
        redirectUrl: params.get('redir') || params.get('originurl') || undefined,
        timestamp: Date.now()
      };
      
      localStorage.setItem('opennds_session', JSON.stringify(openNdsParams));
      console.log('Saved OpenNDS session parameters to localStorage');
    }
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <>
      <div className="bg-background text-foreground min-h-screen">
        {shouldDisplayAppNavBar && (
          <NavBar navigationItems={marketingNavigationItems} />
        )}
        <div className={(location.pathname === "/" || location.pathname === "/home" || location.pathname === "/pricing" || location.pathname === "/login" || location.pathname === "/signup") ? "" : "mx-auto max-w-(--breakpoint-2xl)"}>
          <Outlet />
        </div>
      </div>
      <Toaster position="bottom-right" />
      <CookieConsentBanner />
    </>
  );
}