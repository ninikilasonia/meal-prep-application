import { useState } from "react";

import styles from "./IngredientForm.module.css";

const NUTRITION_FIELDS = [
  { name: "calories", label: "Calories" },
  { name: "protein", label: "Protein (g)" },
  { name: "carbohydrates", label: "Carbs (g)" },
  { name: "fat", label: "Fat (g)" },
  { name: "fiber", label: "Fiber (g)" },
];

const EMPTY_FORM = {
  name: "",
  unit: "",
  calories: "",
  protein: "",
  carbohydrates: "",
  fat: "",
  fiber: "",
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!form.unit.trim()) {
    errors.unit = "Unit is required.";
  }
  for (const field of NUTRITION_FIELDS) {
    const raw = form[field.name];
    if (raw === "") {
      continue;
    }
    const value = Number(raw);
    if (Number.isNaN(value)) {
      errors[field.name] = "Must be a number.";
    } else if (value < 0) {
      errors[field.name] = "Cannot be negative.";
    }
  }
  return errors;
}

function IngredientForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    onSubmit({
      name: form.name.trim(),
      unit: form.unit.trim(),
      calories: Number(form.calories || 0),
      protein: Number(form.protein || 0),
      carbohydrates: Number(form.carbohydrates || 0),
      fat: Number(form.fat || 0),
      fiber: Number(form.fiber || 0),
    });
    setForm(EMPTY_FORM);
    setErrors({});
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Chicken breast"
          />
          {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Unit</span>
          <input
            className={styles.input}
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="e.g. g, ml, piece"
          />
          {errors.unit ? <span className={styles.error}>{errors.unit}</span> : null}
        </label>
      </div>

      <div className={styles.grid}>
        {NUTRITION_FIELDS.map((field) => (
          <label key={field.name} className={styles.field}>
            <span className={styles.label}>{field.label}</span>
            <input
              className={styles.input}
              name={field.name}
              type="number"
              min="0"
              step="any"
              value={form[field.name]}
              onChange={handleChange}
              placeholder="0"
            />
            {errors[field.name] ? (
              <span className={styles.error}>{errors[field.name]}</span>
            ) : null}
          </label>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add ingredient"}
        </button>
      </div>
    </form>
  );
}

export default IngredientForm;
