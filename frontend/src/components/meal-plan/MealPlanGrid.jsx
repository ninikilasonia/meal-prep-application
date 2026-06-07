import MealSlot from "./MealSlot.jsx";
import styles from "./MealPlanGrid.module.css";

const MEAL_TYPE_ORDER = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };

function MealPlanGrid({
  days,
  entries,
  getRecipeName,
  getMemberName,
  onPortionChange,
  onRemove,
}) {
  return (
    <div className={styles.grid}>
      {days.map((day) => {
        const dayEntries = entries
          .filter((entry) => entry.day === day)
          .sort(
            (a, b) =>
              (MEAL_TYPE_ORDER[a.meal_type] ?? 99) -
              (MEAL_TYPE_ORDER[b.meal_type] ?? 99)
          );
        return (
          <section key={day} className={styles.day}>
            <h3 className={styles.dayTitle}>{day}</h3>
            {dayEntries.length === 0 ? (
              <p className={styles.empty}>No meals planned.</p>
            ) : (
              <div className={styles.slots}>
                {dayEntries.map((entry) => (
                  <MealSlot
                    key={entry.id}
                    entry={entry}
                    recipeName={getRecipeName(entry.recipe_id, entry.recipe_name)}
                    memberName={getMemberName(entry.member_id, entry.member_name)}
                    onPortionChange={onPortionChange}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default MealPlanGrid;
