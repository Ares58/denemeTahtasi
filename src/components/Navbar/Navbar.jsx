import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/savtekLogo.png";

const Navbar = ({
  navLinks = [
    { href: "/blog", label: "Blog", type: "route" },
    { href: "#projects", label: "PROJELER", type: "scroll" },
    { href: "#about", label: "HAKKIMIZDA", type: "scroll" },
    { href: "#contact", label: "İLETİŞİM", type: "scroll" },
  ],
}) => {
  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for DOM elements
  const navbarRef = useRef(null);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        if (window.scrollY > 100) {
          navbarRef.current.classList.add("scrolled");
        } else {
          navbarRef.current.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation handler - both routing and scrolling
  const handleNavClick = (e, link) => {
    e.preventDefault();

    // Close mobile menu if open
    setMobileMenuOpen(false);

    if (link.type === "route") {
      // Route navigation (for blog page)
      navigate(link.href);
    } else {
      // Scroll navigation (for sections on same page)
      if (location.pathname !== "/") {
        // If not on home page, first navigate to home then scroll
        navigate("/");
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const target = document.querySelector(link.href);
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      } else {
        // Already on home page, just scroll
        const target = document.querySelector(link.href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }
  };

  // Logo click handler - navigate to home
  const handleLogoClick = () => {
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar" ref={navbarRef} id="navbar">
      <div className="container">
        <div className="nav-content">
          <div
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          >
            <img src={Logo} alt="EGE SAVTEK Logo" className="logo-image" />
          </div>

          <div className="nav-links">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`nav-link ${
                  link.type === "route" && location.pathname === link.href
                    ? "active"
                    : ""
                }`}
                onClick={(e) => handleNavClick(e, link)}
              >
                <span>{link.label}</span>
                <div className="nav-underline"></div>
              </a>
            ))}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`hamburger ${mobileMenuOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        <div
          className="mobile-menu"
          style={{ display: mobileMenuOpen ? "block" : "none" }}
        >
          <div className="mobile-menu-content">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`mobile-nav-link ${
                  link.type === "route" && location.pathname === link.href
                    ? "active"
                    : ""
                }`}
                onClick={(e) => handleNavClick(e, link)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
