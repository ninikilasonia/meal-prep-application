import { useEffect, useId, useRef, useState } from "react";

import styles from "./Select.module.css";

// Normalize a primitive or { value, label } option into a consistent shape.
function normalize(option) {
  if (option !== null && typeof option === "object") {
    return { value: option.value, label: option.label ?? String(option.value) };
  }
  return { value: option, label: String(option) };
}

/**
 * Accessible custom dropdown that fully replaces the native <select> so the
 * open list can be themed (the OS renders the native option list and ignores
 * CSS). Emits a synthetic `{ target: { name, value } }` on change so it drops
 * into the existing form handlers without changes.
 */
function Select({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  label,
  disabled = false,
  id,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const baseId = useId();
  const listId = `${baseId}-list`;

  const items = options.map(normalize);
  const selected = items.find((item) => String(item.value) === String(value));
  const displayLabel = selected ? selected.label : placeholder;

  function emit(nextValue) {
    onChange?.({ target: { name, value: nextValue } });
  }

  function choose(item) {
    emit(item.value);
    setOpen(false);
  }

  // Close when clicking outside the component.
  useEffect(() => {
    if (!open) return undefined;
    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  // On open, highlight the currently selected option (or the first one).
  useEffect(() => {
    if (!open) return;
    const selectedIndex = items.findIndex(
      (item) => String(item.value) === String(value)
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the highlighted option scrolled into view during keyboard nav.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) setOpen(true);
        else setActiveIndex((i) => Math.min(i + 1, items.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) setOpen(true);
        else setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(items.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) setOpen(true);
        else if (items[activeIndex]) choose(items[activeIndex]);
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  const activeOptionId = activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined;

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        id={id}
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? activeOptionId : undefined}
        aria-label={label}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {displayLabel}
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open ? (
        <ul className={styles.list} role="listbox" id={listId} ref={listRef}>
          {items.map((item, index) => {
            const isSelected = String(item.value) === String(value);
            const isActive = index === activeIndex;
            const optionClass = [
              styles.option,
              isActive ? styles.optionActive : "",
              isSelected ? styles.optionSelected : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <li
                key={String(item.value)}
                id={`${baseId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                className={optionClass}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(item)}
              >
                <span className={styles.optionLabel}>{item.label}</span>
                {isSelected ? <span className={styles.check}>✓</span> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export default Select;
