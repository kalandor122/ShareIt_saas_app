import { LogIn, Menu } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Link as ReactRouterLink } from "react-router";
import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../client/components/ui/sheet";
import { UserDropdown } from "../../../user/UserDropdown";
import { UserMenuItems } from "../../../user/UserMenuItems";

import logo from "../../static/Sharenet.svg";
import { cn } from "../../utils";
import DarkModeSwitcher from "../DarkModeSwitcher";


export interface NavigationItem {
  name: string;
  to: string;
}

export default function NavBar({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  return (
    <>
      <header className="fixed top-4 right-0 left-0 z-50 transition-all duration-300">
        <div className="bg-background/40 border-border mx-4 rounded-full border pr-2 shadow-lg backdrop-blur-md md:mx-20 lg:pr-0">
          <nav
            className="flex items-center justify-between p-3 transition-all duration-300 lg:px-6"
            aria-label="Global"
          >
            <div className="flex items-center gap-6">
              <WaspRouterLink
                to={routes.homepageroute.to}
                className="text-foreground hover:text-primary flex items-center transition-colors duration-300 ease-in-out"
              >
                <NavLogo isScrolled={true} />
                <span className="text-foreground ml-2 text-xl font-semibold leading-6 transition-all duration-300">
                  ShareNet
                </span>
              </WaspRouterLink>

              <ul className="ml-4 hidden items-center gap-6 lg:flex">
                {renderNavigationItems(navigationItems)}
              </ul>
            </div>
            <NavBarMobileMenu
              isScrolled={true}
              navigationItems={navigationItems}
            />
            <NavBarDesktopUserDropdown isScrolled={true} />
          </nav>
        </div>
      </header>
    </>
  );
}

function NavBarDesktopUserDropdown({ isScrolled }: { isScrolled: boolean }) {
  const { data: user, isLoading: isUserLoading } = useAuth();

  return (
    <div className="hidden items-center justify-end gap-3 lg:flex lg:flex-1">
      <ul className="flex items-center justify-center gap-2 sm:gap-4">
        <DarkModeSwitcher />
      </ul>
      {isUserLoading ? null : !user ? (
        <WaspRouterLink
          to={routes.LoginRoute.to}
          className={cn(
            "ml-3 leading-6 font-semibold transition-all duration-300",
            {
              "text-sm": !isScrolled,
              "text-xs": isScrolled,
            },
          )}
        >
          <div className="text-foreground hover:text-primary flex items-center transition-colors duration-300 ease-in-out">
            Log in{" "}
            <LogIn
              size={isScrolled ? "1rem" : "1.1rem"}
              className={cn("transition-all duration-300", {
                "mt-[0.1rem] ml-1": !isScrolled,
                "ml-1": isScrolled,
              })}
            />
          </div>
        </WaspRouterLink>
      ) : (
        <div className="ml-3">
          <UserDropdown user={user} />
        </div>
      )}
    </div>
  );
}

function NavBarMobileMenu({
  isScrolled,
  navigationItems,
}: {
  isScrolled: boolean;
  navigationItems: NavigationItem[];
}) {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex lg:hidden">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              "text-muted-foreground hover:text-muted hover:bg-accent inline-flex items-center justify-center rounded-md transition-colors",
            )}
          >
            <span className="sr-only">Open main menu</span>
            <Menu
              className={cn("transition-all duration-300", {
                "size-8 p-1": !isScrolled,
                "size-6 p-0.5": isScrolled,
              })}
              aria-hidden="true"
            />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <WaspRouterLink to={routes.PricingPageRoute.to}>
                <span className="sr-only text-xl">ShareNet</span>
                <NavLogo isScrolled={false} />
              </WaspRouterLink>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flow-root">
            <div className="divide-border -my-6 divide-y">
              <ul className="space-y-2 py-6">
                {renderNavigationItems(navigationItems, setMobileMenuOpen)}
              </ul>
              <div className="py-6">
                {isUserLoading ? null : !user ? (
                  <WaspRouterLink to={routes.LoginRoute.to}>
                    <div className="text-foreground hover:text-primary flex items-center justify-end transition-colors duration-300 ease-in-out">
                      Log in <LogIn size="1.1rem" className="ml-1" />
                    </div>
                  </WaspRouterLink>
                ) : (
                  <ul className="space-y-2">
                    <UserMenuItems
                      user={user}
                      onItemClick={() => setMobileMenuOpen(false)}
                    />
                  </ul>
                )}
              </div>
              <div className="py-6">
                <DarkModeSwitcher />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function renderNavigationItems(
  navigationItems: NavigationItem[],
  setMobileMenuOpen?: Dispatch<SetStateAction<boolean>>,
) {
  const menuStyles = cn({
    "block rounded-lg px-3 py-2 text-sm font-medium leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors":
      !!setMobileMenuOpen,
    "text-sm font-normal leading-6 text-foreground duration-300 ease-in-out hover:text-primary transition-colors":
      !setMobileMenuOpen,
  });

  return navigationItems.map((item) => {
    return (
      <li key={item.name}>
        <ReactRouterLink
          to={item.to}
          className={menuStyles}
          onClick={setMobileMenuOpen && (() => setMobileMenuOpen(false))}
          target={item.to.startsWith("http") ? "_blank" : undefined}
        >
          {item.name}
        </ReactRouterLink>
      </li>
    );
  });
}

const NavLogo = ({ isScrolled }: { isScrolled: boolean }) => (
  <img
    className={cn("transition-all duration-500 mt-0 mb-0 p-0 ", {

      "size-16": !isScrolled,
      "size-15": isScrolled,

    })}
    src={logo}
    alt="ShareNet"
  />
);
