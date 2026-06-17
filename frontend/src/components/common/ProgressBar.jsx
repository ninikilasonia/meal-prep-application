import { formatNumber } from "../../utils/formatUtils.js";
import styles from "./ProgressBar.module.css";

// Simple goal progress bar. The fill is capped at 100% for layout, but the
// actual value is always shown (even when it exceeds the goal). Guards against
// a missing or zero goal so it never divides by zero.
function ProgressBar({ label, value, goal, unit = "" }) {
  const hasGoal = typeof goal === "number" && goal > 0;
  const pct = hasGoal ? Math.min((Number(value) / goal) * 100, 100) : 0;
  const over = hasGoal && Number(value) > goal;

  return (
    <div className={styles.row}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {formatNumber(value)}
          {hasGoal ? ` / ${formatNumber(goal)}` : ""}
          {unit ? ` ${unit}` : ""}
          {!hasGoal ? <span className={styles.noGoal}> (no goal)</span> : null}
        </span>
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${over ? styles.over : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
