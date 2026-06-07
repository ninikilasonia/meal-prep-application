import { useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import MealPlanGrid from "../components/meal-plan/MealPlanGrid.jsx";
import styles from "./MealPlanPage.module.css";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

// Temporary options — replaced by /recipes and /household-members in Task 24.
const PLACEHOLDER_RECIPES = [
  { id: 1, name: "Chicken Rice Bowl" },
  { id: 2, name: "Veggie Omelette" },
];
const PLACEHOLDER_MEMBERS = [
  { id: 1, name: "Adult Maintain" },
  { id: 2, name: "Teen Gain" },
];

const EMPTY_DRAFT = {
  day: "monday",
  meal_type: "breakfast",
  recipe_id: "",
  member_id: "",
  portion_multiplier: "1",
};

function MealPlanPage() {
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [error, setError] = useState(null);

  function handleDraftChange(event) {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function handleAdd(event) {
    event.preventDefault();
    if (!draft.recipe_id || !draft.member_id) {
      setError("Select both a recipe and a household member.");
      return;
    }
    setError(null);
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        day: draft.day,
        meal_type: draft.meal_type,
        recipe_id: Number(draft.recipe_id),
        member_id: Number(draft.member_id),
        portion_multiplier: Number(draft.portion_multiplier) || 1,
      },
    ]);
    setDraft((prev) => ({ ...EMPTY_DRAFT, day: prev.day }));
  }

  function handlePortionChange(id, value) {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, portion_multiplier: value } : entry
      )
    );
  }

  function handleRemove(id) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  const getRecipeName = (id) =>
    PLACEHOLDER_RECIPES.find((r) => r.id === id)?.name ?? `Recipe #${id}`;
  const getMemberName = (id) =>
    PLACEHOLDER_MEMBERS.find((m) => m.id === id)?.name ?? `Member #${id}`;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Meal Plan"
        description="Plan recipes for each day and household member. Adjust portions per planned meal."
      />

      <Card title="Add to plan">
        {error ? <p className={styles.error}>{error}</p> : null}
        <form className={styles.addForm} onSubmit={handleAdd}>
          <label className={styles.field}>
            <span className={styles.label}>Day</span>
            <select className={styles.input} name="day" value={draft.day} onChange={handleDraftChange}>
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Meal</span>
            <select className={styles.input} name="meal_type" value={draft.meal_type} onChange={handleDraftChange}>
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Recipe</span>
            <select className={styles.input} name="recipe_id" value={draft.recipe_id} onChange={handleDraftChange}>
              <option value="">Select…</option>
              {PLACEHOLDER_RECIPES.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Member</span>
            <select className={styles.input} name="member_id" value={draft.member_id} onChange={handleDraftChange}>
              <option value="">Select…</option>
              {PLACEHOLDER_MEMBERS.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Portion ×</span>
            <input
              className={styles.input}
              type="number"
              min="0"
              step="0.1"
              name="portion_multiplier"
              value={draft.portion_multiplier}
              onChange={handleDraftChange}
            />
          </label>
          <button type="submit" className={styles.addBtn}>
            Add
          </button>
        </form>
      </Card>

      <Card title="Weekly plan">
        <MealPlanGrid
          days={DAYS}
          entries={entries}
          getRecipeName={getRecipeName}
          getMemberName={getMemberName}
          onPortionChange={handlePortionChange}
          onRemove={handleRemove}
        />
      </Card>
    </div>
  );
}

export default MealPlanPage;
