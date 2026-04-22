import { LoginForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { NewAuthPageLayout } from "./NewAuthPageLayout";

export default function Login() {
  return (
    <NewAuthPageLayout>
      <LoginForm />
      <div className="auth-links-container">
        <span className="auth-link-text">
          Nincs még fiókod?{" "}
          <WaspRouterLink to={routes.SignupRoute.to}>
            Regisztrálj itt
          </WaspRouterLink>
        </span>
        <span className="auth-link-text">
          Elfelejtetted a jelszavad?{" "}
          <WaspRouterLink to={routes.RequestPasswordResetRoute.to}>
            Új jelszó kérése
          </WaspRouterLink>
        </span>
      </div>
    </NewAuthPageLayout>
  );
}
