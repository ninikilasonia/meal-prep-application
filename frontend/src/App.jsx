import styles from "./App.module.css";

function App() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.badge}>Frontend setup</span>
        <h1 className={styles.title}>Web-Based Meal Prep Platform</h1>
        <p className={styles.subtitle}>
          React + Vite frontend is up and running. Pages for ingredients,
          recipes, household members, meal plans, and shopping lists come next.
        </p>
      </section>
    </main>
  );
}

export default App;
