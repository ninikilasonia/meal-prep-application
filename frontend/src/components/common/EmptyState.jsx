import styles from "./EmptyState.module.css";

function EmptyState({ icon = "🍽️", title, message, action }) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}

export default EmptyState;
