import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import styles from "./AppLayout.module.css";

function AppLayout() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
