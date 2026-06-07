import PortionEditor from "./PortionEditor.jsx";
import styles from "./MealSlot.module.css";

function MealSlot({ entry, recipeName, memberName, onPortionChange, onRemove }) {
  return (
    <div className={styles.slot}>
      <div className={styles.top}>
        <span className={styles.mealType}>{entry.meal_type}</span>
        <button
          type="button"
          className={styles.remove}
          onClick={() => onRemove(entry.id)}
          aria-label="Remove planned meal"
        >
          ×
        </button>
      </div>
      <p className={styles.recipe}>{recipeName}</p>
      <p className={styles.member}>for {memberName}</p>
      <PortionEditor
        value={entry.portion_multiplier}
        onChange={(value) => onPortionChange(entry.id, value)}
      />
    </div>
  );
}

export default MealSlot;
