import { useState } from "react";

import styles from "./MemberForm.module.css";

const SEX_OPTIONS = ["male", "female", "other"];
const ACTIVITY_OPTIONS = ["low", "medium", "high"];
const GOAL_OPTIONS = ["lose", "maintain", "gain"];

const EMPTY_FORM = {
  name: "",
  age: "",
  sex: "",
  height: "",
  weight: "",
  activity_level: "",
  goal: "",
  dietary_restrictions: "",
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.sex) errors.sex = "Sex is required.";
  if (!form.activity_level) errors.activity_level = "Activity level is required.";
  if (!form.goal) errors.goal = "Goal is required.";

  const numeric = [
    ["age", "Age"],
    ["height", "Height"],
    ["weight", "Weight"],
  ];
  for (const [field, label] of numeric) {
    const value = Number(form[field]);
    if (form[field] === "" || Number.isNaN(value) || value <= 0) {
      errors[field] = `${label} must be greater than 0.`;
    }
  }
  return errors;
}

function MemberForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    const succeeded = await onSubmit({
      name: form.name.trim(),
      age: Number(form.age),
      sex: form.sex,
      height: Number(form.height),
      weight: Number(form.weight),
      activity_level: form.activity_level,
      goal: form.goal,
      dietary_restrictions: form.dietary_restrictions.trim(),
    });
    if (succeeded !== false) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }

  function renderSelect(name, label, options) {
    return (
      <label className={styles.field}>
        <span className={styles.label}>{label}</span>
        <select
          className={styles.input}
          name={name}
          value={form[name]}
          onChange={handleChange}
        >
          <option value="">Select…</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors[name] ? <span className={styles.error}>{errors[name]}</span> : null}
      </label>
    );
  }

  function renderNumber(name, label) {
    return (
      <label className={styles.field}>
        <span className={styles.label}>{label}</span>
        <input
          className={styles.input}
          name={name}
          type="number"
          min="0"
          step="any"
          value={form[name]}
          onChange={handleChange}
        />
        {errors[name] ? <span className={styles.error}>{errors[name]}</span> : null}
      </label>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Adult Maintain"
          />
          {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
        </label>
        {renderNumber("age", "Age")}
        {renderSelect("sex", "Sex", SEX_OPTIONS)}
        {renderNumber("height", "Height (cm)")}
        {renderNumber("weight", "Weight (kg)")}
        {renderSelect("activity_level", "Activity level", ACTIVITY_OPTIONS)}
        {renderSelect("goal", "Goal", GOAL_OPTIONS)}
        <label className={styles.field}>
          <span className={styles.label}>Dietary restrictions (optional)</span>
          <input
            className={styles.input}
            name="dietary_restrictions"
            value={form.dietary_restrictions}
            onChange={handleChange}
            placeholder="e.g. vegetarian"
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Add member"}
        </button>
      </div>
    </form>
  );
}

export default MemberForm;
