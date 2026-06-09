import { useState } from "react";

import styles from "./RecipeForm.module.css";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

const EMPTY_FORM = {
  name: "",
  description: "",
  meal_type: "",
  base_servings: "1",
};

function RecipeForm({ availableIngredients = [], onSubmit, submitting = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState([]);
  const [picker, setPicker] = useState({ ingredientId: "", quantity: "" });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addIngredient() {
    const id = Number(picker.ingredientId);
    const quantity = Number(picker.quantity);
    const nextErrors = {};
    if (!picker.ingredientId) {
      nextErrors.picker = "Select an ingredient.";
    } else if (selected.some((item) => item.ingredient_id === id)) {
      nextErrors.picker = "Ingredient already added.";
    } else if (!picker.quantity || Number.isNaN(quantity) || quantity <= 0) {
      nextErrors.picker = "Quantity must be greater than 0.";
    }
    setErrors((prev) => ({ ...prev, picker: nextErrors.picker }));
    if (nextErrors.picker) {
      return;
    }
    const ingredient = availableIngredients.find((item) => item.id === id);
    setSelected((prev) => [
      ...prev,
      {
        ingredient_id: id,
        ingredient_name: ingredient?.name ?? `#${id}`,
        unit: ingredient?.unit ?? "",
        quantity,
      },
    ]);
    setPicker({ ingredientId: "", quantity: "" });
  }

  function removeIngredient(id) {
    setSelected((prev) => prev.filter((item) => item.ingredient_id !== id));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Recipe name is required.";
    if (!form.meal_type) next.meal_type = "Meal type is required.";
    const servings = Number(form.base_servings);
    if (Number.isNaN(servings) || servings <= 0) {
      next.base_servings = "Base servings must be greater than 0.";
    }
    if (selected.length === 0) {
      next.ingredients = "Add at least one ingredient.";
    }
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    const succeeded = await onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      meal_type: form.meal_type,
      base_servings: Number(form.base_servings),
      ingredients: selected.map((item) => ({
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
      })),
    });
    if (succeeded !== false) {
      setForm(EMPTY_FORM);
      setSelected([]);
      setPicker({ ingredientId: "", quantity: "" });
      setErrors({});
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Recipe name</span>
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Chicken Rice Bowl"
          />
          {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Meal type</span>
          <select
            className={styles.input}
            name="meal_type"
            value={form.meal_type}
            onChange={handleChange}
          >
            <option value="">Select…</option>
            {MEAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.meal_type ? (
            <span className={styles.error}>{errors.meal_type}</span>
          ) : null}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Base servings</span>
          <input
            className={styles.input}
            name="base_servings"
            type="number"
            min="0"
            step="any"
            value={form.base_servings}
            onChange={handleChange}
          />
          {errors.base_servings ? (
            <span className={styles.error}>{errors.base_servings}</span>
          ) : null}
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Description (optional)</span>
        <textarea
          className={styles.input}
          name="description"
          rows={2}
          value={form.description}
          onChange={handleChange}
          placeholder="Simple meal prep recipe"
        />
      </label>

      <fieldset className={styles.picker}>
        <legend className={styles.label}>Ingredients</legend>
        <div className={styles.pickerRow}>
          <select
            className={styles.input}
            value={picker.ingredientId}
            onChange={(e) => setPicker((p) => ({ ...p, ingredientId: e.target.value }))}
          >
            <option value="">Select ingredient…</option>
            {availableIngredients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.unit})
              </option>
            ))}
          </select>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="any"
            placeholder="Quantity"
            value={picker.quantity}
            onChange={(e) => setPicker((p) => ({ ...p, quantity: e.target.value }))}
          />
          <button type="button" className={styles.addBtn} onClick={addIngredient}>
            Add
          </button>
        </div>
        {errors.picker ? <span className={styles.error}>{errors.picker}</span> : null}
        {errors.ingredients ? (
          <span className={styles.error}>{errors.ingredients}</span>
        ) : null}

        {selected.length > 0 ? (
          <ul className={styles.selectedList}>
            {selected.map((item) => (
              <li key={item.ingredient_id} className={styles.selectedItem}>
                <span>
                  {item.ingredient_name} — {item.quantity} {item.unit}
                </span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeIngredient(item.ingredient_id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.hint}>No ingredients added yet.</p>
        )}
      </fieldset>

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save recipe"}
        </button>
      </div>
    </form>
  );
}

export default RecipeForm;
