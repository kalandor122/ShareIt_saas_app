import { SignupForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { NewAuthPageLayout } from "./NewAuthPageLayout";

export function NewSignup() {
  return (
    <NewAuthPageLayout>
      <SignupForm />
      <div className="auth-links-container">
        <span className="auth-link-text">
          Már van fiókod?{" "}
          <WaspRouterLink to={routes.LoginRoute.to}>
            Jelentkezz be
          </WaspRouterLink>
        </span>
      </div>
    </NewAuthPageLayout>
  );
}
