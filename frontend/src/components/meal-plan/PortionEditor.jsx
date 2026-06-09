import styles from "./PortionEditor.module.css";

function PortionEditor({ value, onChange }) {
  return (
    <label className={styles.editor}>
      <span className={styles.label}>Portion ×</span>
      <input
        className={styles.input}
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default PortionEditor;
