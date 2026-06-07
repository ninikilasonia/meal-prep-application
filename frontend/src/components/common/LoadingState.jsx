import styles from "./LoadingState.module.css";

function LoadingState({ label = "Loading…" }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingState;
