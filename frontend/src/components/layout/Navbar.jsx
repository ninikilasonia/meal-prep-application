import { NavLink } from "react-router-dom";

import styles from "./Navbar.module.css";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/ingredients", label: "Ingredients" },
  { to: "/recipes", label: "Recipes" },
  { to: "/household", label: "Household" },
  { to: "/meal-plan", label: "Meal Plan" },
  { to: "/shopping-list", label: "Shopping List" },
];

function Navbar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>🥗</span>
        <span className={styles.brandText}>Meal Prep</span>
      </div>
      <nav className={styles.nav}>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Navbar;
