import { useCallback, useEffect, useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import Alert from "../components/common/Alert.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ShoppingListTable from "../components/shopping-list/ShoppingListTable.jsx";
import { getShoppingList } from "../api/shoppingListApi.js";
import {
  createPantryItem,
  getPantry,
  updatePantryItem,
} from "../api/pantryApi.js";
import styles from "./ShoppingListPage.module.css";

// Keep "to buy" never below zero for instant local feedback while editing.
// The backend recomputes the authoritative value on the next refresh.
function withFinalQuantity(item) {
  const required = Number(item.required_quantity) || 0;
  const available = Number(item.available_quantity) || 0;
  return { ...item, final_quantity_to_buy: Math.max(required - available, 0) };
}

const pantryItemId = (item) => item.id ?? item.pantry_item_id;

function ShoppingListPage() {
  const [items, setItems] = useState([]);
  const [pantryMap, setPantryMap] = useState({});
  const [dirty, setDirty] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, pantry] = await Promise.all([getShoppingList(), getPantry()]);
      setItems((Array.isArray(list) ? list : []).map(withFinalQuantity));
      const map = {};
      for (const entry of Array.isArray(pantry) ? pantry : []) {
        map[entry.ingredient_id] = pantryItemId(entry);
      }
      setPantryMap(map);
      setDirty(new Set());
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleAvailableChange(ingredientId, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.ingredient_id === ingredientId
          ? withFinalQuantity({ ...item, available_quantity: value })
          : item
      )
    );
    setDirty((prev) => new Set(prev).add(ingredientId));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const edited = items.filter((item) => dirty.has(item.ingredient_id));
      for (const item of edited) {
        const available = Number(item.available_quantity) || 0;
        const existingId = pantryMap[item.ingredient_id];
        if (existingId !== undefined) {
          await updatePantryItem(existingId, { available_quantity: available });
        } else {
          await createPantryItem({
            ingredient_id: item.ingredient_id,
            available_quantity: available,
          });
        }
      }
      setSuccess("Pantry quantities saved.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Shopping List"
        description="A generated list of ingredients you still need to buy, based on your planned meals and what you already have at home."
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

      <Card
        title="Ingredients to buy"
        actions={
          <div className={styles.actions}>
            {dirty.size > 0 ? (
              <button
                type="button"
                className={styles.save}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save available quantities"}
              </button>
            ) : null}
            <button
              type="button"
              className={styles.generate}
              onClick={load}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        }
      >
        {loading ? (
          <LoadingState label="Generating shopping list…" />
        ) : items.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="No shopping list yet"
            message="Plan some meals first, then refresh to see what you need to buy."
          />
        ) : (
          <ShoppingListTable items={items} onAvailableChange={handleAvailableChange} />
        )}
      </Card>
    </div>
  );
}

export default ShoppingListPage;
