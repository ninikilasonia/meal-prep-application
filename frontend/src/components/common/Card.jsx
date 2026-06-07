import styles from "./Card.module.css";

function Card({ title, actions, children, className }) {
  return (
    <section className={className ? `${styles.card} ${className}` : styles.card}>
      {title || actions ? (
        <div className={styles.head}>
          {title ? <h2 className={styles.title}>{title}</h2> : <span />}
          {actions ? <div>{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export default Card;
