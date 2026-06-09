import { useCallback, useEffect, useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import Alert from "../components/common/Alert.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import IngredientForm from "../components/forms/IngredientForm.jsx";
import {
  createIngredient,
  deleteIngredient,
  getIngredients,
} from "../api/ingredientsApi.js";
import styles from "./IngredientsPage.module.css";

const NUTRITION_COLUMNS = [
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein" },
  { key: "carbohydrates", label: "Carbs" },
  { key: "fat", label: "Fat" },
  { key: "fiber", label: "Fiber" },
];

function IngredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const loadIngredients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIngredients();
      setIngredients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  async function handleAdd(ingredient) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createIngredient(ingredient);
      setIngredients((prev) => [...prev, created]);
      setSuccess(`Added "${created.name}".`);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError(null);
    setSuccess(null);
    try {
      await deleteIngredient(id);
      setIngredients((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Ingredients"
        description="Build your ingredient library. Each ingredient stores nutrition per unit, used to calculate recipe nutrition."
      />

      {error ? (
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert variant="success" onDismiss={() => setSuccess(null)}>
          {success}
        </Alert>
      ) : null}

      <Card title="Add ingredient">
        <IngredientForm onSubmit={handleAdd} submitting={submitting} />
      </Card>

      <Card title={`Ingredient library (${ingredients.length})`}>
        {loading ? (
          <LoadingState label="Loading ingredients…" />
        ) : ingredients.length === 0 ? (
          <EmptyState
            icon="🥕"
            title="No ingredients yet"
            message="Add your first ingredient using the form above to start your library."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Unit</th>
                  {NUTRITION_COLUMNS.map((col) => (
                    <th key={col.key} className={styles.num}>
                      {col.label}
                    </th>
                  ))}
                  <th aria-label="actions" />
                </tr>
              </thead>
              <tbody>
                {ingredients.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    {NUTRITION_COLUMNS.map((col) => (
                      <td key={col.key} className={styles.num}>
                        {item[col.key]}
                      </td>
                    ))}
                    <td className={styles.num}>
                      <button
                        type="button"
                        className={styles.delete}
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default IngredientsPage;
