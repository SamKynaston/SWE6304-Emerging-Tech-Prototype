import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { NavigationProps } from "@prototype/types";
import { useAuth } from "../Context/Authentication";
import icon from "../../public/logo.svg";
import { logout } from "../Services/Users.service";

function Navigation({ }: NavigationProps) {
  const { authenticated, hasPermission } = useAuth() as any;
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      if (await logout()) {
        window.location.reload();
      }
    } catch (error) {
      alert("Unable to log out. Please try again.");
    }
  };

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <div className="Navigation">
      <div className="Navigation-Start">
        <Link to={"/"} key={"/"} className="Navigation-Button">
          <img
              src={icon}
              alt="Library"
              className="Navigation-Icon"
            />
        </Link>

        {/*<div className="Navigation-Button w-full justify-start">
          <button className="w-full"></button>
        </div>*/}
      </div>

      <div className="Navigation-End">
        {
          // If an administrator, then add the dashboard to their navigiation
          hasPermission("ADMINISTRATOR") ? (
            <Link to="/admin" className="Navigation-Button">
              <i className="fa-solid fa-wrench"></i>
            </Link>
          ) : null
        }

        { /* If signed in, then show "Account" as opposed to "Sign Up", alongside a solid user icon */ }
        { !authenticated ? (
          <Link to={"/login"} className="Navigation-Button">
            <i className="fa-regular fa-user"></i>
          </Link>
        ) : (
          <div ref={accountMenuRef}>
            <button type="button" className="Navigation-Button border-0 bg-transparent text-current" aria-label="Sign in" onClick={() => setAccountMenuOpen((open) => !open)}>
              <i className="fa-solid fa-user" />
            </button>

            {accountMenuOpen && (
              <div className="Navigation-AccountMenu" role="menu">
                <Link role="menuitem" to="/account" onClick={() => setAccountMenuOpen(false)}>
                  Account
                </Link>
                <Link role="menuitem" to="/account/edit" onClick={() => setAccountMenuOpen(false)}>
                  Edit account
                </Link>
                <Link role="menuitem" to="/account/chat" onClick={() => setAccountMenuOpen(false)}>
                  Chatbot (PROTOTYPE)
                </Link>
                <a role="menuitem" onClick={handleLogout}>
                  Log out
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;