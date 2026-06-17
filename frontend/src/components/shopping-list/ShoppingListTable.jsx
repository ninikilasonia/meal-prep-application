import { formatNumber } from "../../utils/formatUtils.js";
import styles from "./ShoppingListTable.module.css";

// Presentational table for shopping-list items. The available quantity is
// editable; the parent decides how to recompute the final quantity to buy.
function ShoppingListTable({ items, onAvailableChange }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Unit</th>
            <th className={styles.numCol}>Required</th>
            <th className={styles.numCol}>Available</th>
            <th className={styles.numCol}>To buy</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.ingredient_id}>
              <td>{item.ingredient_name ?? `Ingredient #${item.ingredient_id}`}</td>
              <td>{item.unit || "—"}</td>
              <td className={styles.numCol}>{formatNumber(item.required_quantity)}</td>
              <td className={styles.numCol}>
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  step="any"
                  value={item.available_quantity ?? 0}
                  onChange={(event) =>
                    onAvailableChange(item.ingredient_id, event.target.value)
                  }
                  aria-label={`Available quantity for ${item.ingredient_name}`}
                />
              </td>
              <td className={`${styles.numCol} ${styles.buy}`}>
                {formatNumber(item.final_quantity_to_buy)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShoppingListTable;
