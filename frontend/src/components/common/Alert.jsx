import styles from "./Alert.module.css";

const VARIANTS = {
  error: styles.error,
  success: styles.success,
  info: styles.info,
};

function Alert({ variant = "info", children, onDismiss }) {
  return (
    <div className={`${styles.alert} ${VARIANTS[variant] || styles.info}`} role="alert">
      <span className={styles.message}>{children}</span>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} onClick={onDismiss}>
          ×
        </button>
      ) : null}
    </div>
  );
}

export default Alert;
