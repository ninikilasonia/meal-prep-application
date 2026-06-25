import { useCallback, useEffect, useMemo, useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import Select from "../components/common/Select.jsx";
import Alert from "../components/common/Alert.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import MealPlanGrid from "../components/meal-plan/MealPlanGrid.jsx";
import { getRecipes } from "../api/recipesApi.js";
import { getHouseholdMembers } from "../api/householdApi.js";
import {
  createMealPlanEntry,
  deleteMealPlanEntry,
  getMealPlan,
  updateMealPlanEntry,
} from "../api/mealPlanApi.js";
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

const EMPTY_DRAFT = {
  day: "monday",
  meal_type: "breakfast",
  recipe_id: "",
  member_id: "",
  portion_multiplier: "1",
};

function MealPlanPage() {
  const [entries, setEntries] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [members, setMembers] = useState([]);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  // Whether the backend meal-plan endpoints are available. Until Nino adds
  // them, the plan is kept in session-only local state.
  const [planPersisted, setPlanPersisted] = useState(false);

  const recipesById = useMemo(
    () => Object.fromEntries(recipes.map((r) => [r.id, r])),
    [recipes]
  );
  const membersById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])),
    [members]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [recipeData, memberData] = await Promise.all([
        getRecipes(),
        getHouseholdMembers(),
      ]);
      setRecipes(recipeData);
      setMembers(memberData);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // The meal-plan endpoints may not exist yet — degrade gracefully.
    try {
      const planData = await getMealPlan();
      setEntries(planData);
      setPlanPersisted(true);
      setNotice(null);
    } catch {
      setPlanPersisted(false);
      setNotice(
        "Meal plan saving isn't available on the backend yet, so your plan is kept in this session only."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleDraftChange(event) {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAdd(event) {
    event.preventDefault();
    if (!draft.recipe_id || !draft.member_id) {
      setError("Select both a recipe and a household member.");
      return;
    }
    setError(null);
    const payload = {
      day: draft.day,
      meal_type: draft.meal_type,
      recipe_id: Number(draft.recipe_id),
      member_id: Number(draft.member_id),
      portion_multiplier: Number(draft.portion_multiplier) || 1,
    };

    if (planPersisted) {
      try {
        const created = await createMealPlanEntry(payload);
        setEntries((prev) => [...prev, created]);
      } catch (err) {
        setError(err.message);
        return;
      }
    } else {
      setEntries((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    setDraft((prev) => ({ ...EMPTY_DRAFT, day: prev.day }));
  }

  function handlePortionChange(id, value) {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, portion_multiplier: value } : entry
      )
    );
    if (planPersisted) {
      updateMealPlanEntry(id, { portion_multiplier: value }).catch((err) =>
        setError(err.message)
      );
    }
  }

  async function handleRemove(id) {
    if (planPersisted) {
      try {
        await deleteMealPlanEntry(id);
      } catch (err) {
        setError(err.message);
        return;
      }
    }
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  const getRecipeName = (id, fallbackName) =>
    recipesById[id]?.name ?? fallbackName ?? `Recipe #${id}`;
  const getMemberName = (id, fallbackName) =>
    membersById[id]?.name ?? fallbackName ?? `Member #${id}`;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Meal Plan"
        description="Plan recipes for each day and household member. Adjust portions per planned meal."
      />

      {error ? (
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      ) : null}
      {notice ? <Alert variant="info">{notice}</Alert> : null}

      <Card title="Add to plan">
        <form className={styles.addForm} onSubmit={handleAdd}>
          <div className={styles.field}>
            <span className={styles.label}>Day</span>
            <Select name="day" label="Day" value={draft.day} onChange={handleDraftChange} options={DAYS} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Meal</span>
            <Select name="meal_type" label="Meal" value={draft.meal_type} onChange={handleDraftChange} options={MEAL_TYPES} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Recipe</span>
            <Select
              name="recipe_id"
              label="Recipe"
              value={draft.recipe_id}
              onChange={handleDraftChange}
              options={recipes.map((recipe) => ({ value: recipe.id, label: recipe.name }))}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Member</span>
            <Select
              name="member_id"
              label="Member"
              value={draft.member_id}
              onChange={handleDraftChange}
              options={members.map((member) => ({ value: member.id, label: member.name }))}
            />
          </div>
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
        {recipes.length === 0 || members.length === 0 ? (
          <p className={styles.hint}>
            Add at least one recipe and one household member to build a plan.
          </p>
        ) : null}
      </Card>

      <Card title="Weekly plan">
        {loading ? (
          <LoadingState label="Loading meal plan…" />
        ) : (
          <MealPlanGrid
            days={DAYS}
            entries={entries}
            getRecipeName={getRecipeName}
            getMemberName={getMemberName}
            onPortionChange={handlePortionChange}
            onRemove={handleRemove}
          />
        )}
      </Card>
    </div>
  );
}

export default MealPlanPage;
