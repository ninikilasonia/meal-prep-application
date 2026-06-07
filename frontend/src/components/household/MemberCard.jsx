import { formatNumber } from "../../utils/formatUtils.js";
import styles from "./MemberCard.module.css";

const GOAL_FIELDS = [
  { key: "daily_calorie_goal", label: "Calories" },
  { key: "daily_protein_goal", label: "Protein (g)" },
  { key: "daily_fiber_goal", label: "Fiber (g)" },
];

function MemberCard({ member, onDelete }) {
  const hasGoals = GOAL_FIELDS.some((field) => member[field.key]);

  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div>
          <h3 className={styles.name}>{member.name}</h3>
          <p className={styles.meta}>
            {member.age} yrs · {member.sex} · {member.goal}
          </p>
        </div>
        <button type="button" className={styles.delete} onClick={() => onDelete(member.id)}>
          Delete
        </button>
      </header>

      <dl className={styles.details}>
        <div>
          <dt>Height</dt>
          <dd>{member.height} cm</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>{member.weight} kg</dd>
        </div>
        <div>
          <dt>Activity</dt>
          <dd className={styles.capitalize}>{member.activity_level}</dd>
        </div>
        {member.dietary_restrictions ? (
          <div>
            <dt>Diet</dt>
            <dd>{member.dietary_restrictions}</dd>
          </div>
        ) : null}
      </dl>

      <section className={styles.goals}>
        <h4 className={styles.goalsTitle}>Daily goals</h4>
        {hasGoals ? (
          <div className={styles.goalGrid}>
            {GOAL_FIELDS.map((field) => (
              <div key={field.key} className={styles.goalItem}>
                <span className={styles.goalValue}>{formatNumber(member[field.key])}</span>
                <span className={styles.goalLabel}>{field.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.fallback}>Daily goals are not set yet.</p>
        )}
      </section>
    </article>
  );
}

export default MemberCard;
