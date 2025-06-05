import { useState } from "react";

function BudgetSection({
  title,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  presetCategories = [],
  categoryTotal,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [presetEditing, setPresetEditing] = useState(null);
  const [presetAmount, setPresetAmount] = useState("");
  const [hiddenPresets, setHiddenPresets] = useState([]); // Track deleted presets

  const toggleOpen = () => setIsOpen(!isOpen);

  // Merge preset categories and user-added categories
  // Only filter out preset categories that are NOT hidden
  const customItems = items.filter(
    (item) =>
      !(
        presetCategories.includes(item.category) &&
        !hiddenPresets.includes(item.category)
      )
  );

  const visiblePresets = presetCategories.filter(
    (cat) => !hiddenPresets.includes(cat)
  );
  const mergedItems = [
    ...visiblePresets.map((cat) => {
      const found = items.find((item) => item.category === cat);
      return (
        found || {
          id: cat,
          category: cat,
          amount: "",
          isPreset: true,
        }
      );
    }),
    ...customItems,
  ];

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newCategory || !newAmount) return;
    onAddItem({
      id: Date.now() + Math.random(),
      category: newCategory,
      amount: parseFloat(newAmount),
    });
    setNewCategory("");
    setNewAmount("");
    setShowForm(false);
  };

  const handlePresetSave = (category) => {
    if (!presetAmount) return;
    onAddItem({
      id: Date.now() + Math.random(),
      category,
      amount: parseFloat(presetAmount),
    });
    setPresetEditing(null);
    setPresetAmount("");
  };

  const handleDelete = (item) => {
    if (presetCategories.includes(item.category)) {
      setHiddenPresets((prev) => [...prev, item.category]);
      // Optionally, also remove from items if it was assigned
      if (item.amount !== "") {
        onDeleteItem(item.id);
      }
    } else {
      onDeleteItem(item.id);
    }
  };

  return (
    <div className="budget-section">
      <div className="section-header" style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ flex: 1 }}>
          {title} <span style={{ fontWeight: "normal", fontSize: "1rem" }}>(${categoryTotal.toFixed(2)})</span>
        </h2>
        <span className="arrow">{isOpen ? "⌄" : "⌃"}</span>
        <button
          className="black-button"
          style={{ marginLeft: "1rem" }}
          onClick={e => {
            e.stopPropagation();
            setShowForm(true);
          }}
        >
          Add Item
        </button>
      </div>

      {isOpen && (
        <div className="section-content">
          {mergedItems.map((item) =>
            editId === item.id ? (
              <form
                key={item.id}
                onSubmit={e => {
                  e.preventDefault();
                  onEditItem(item.id, { category: editCategory, amount: parseFloat(editAmount) });
                  setEditId(null);
                  setEditCategory("");
                  setEditAmount("");
                }}
                style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}
              >
                <input
                  type="text"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  required
                  style={{ marginRight: "0.5rem" }}
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  style={{ marginRight: "0.5rem", width: "80px" }}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditId(null)} style={{ marginLeft: "0.5rem" }}>
                  Cancel
                </button>
              </form>
            ) : (
              <div
                className="budget-item"
                key={item.id}
                style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}
              >
                <span style={{ flex: 1 }}>{item.category}</span>
                <span style={{ marginLeft: "1rem", minWidth: "80px" }}>
                  {item.amount !== "" && item.amount !== undefined
                    ? `$${Number(item.amount).toFixed(2)}`
                    : (
                      presetEditing === item.category ? (
                        <>
                          <input
                            type="number"
                            value={presetAmount}
                            onChange={e => setPresetAmount(e.target.value)}
                            min="0"
                            step="0.01"
                            style={{ width: "80px" }}
                          />
                          <button style={{ marginLeft: "0.5rem" }} onClick={() => handlePresetSave(item.category)}>Save</button>
                          <button style={{ marginLeft: "0.5rem" }} onClick={() => setPresetEditing(null)}>Cancel</button>
                        </>
                      ) : (
                        <button style={{ marginLeft: "1rem" }} onClick={() => setPresetEditing(item.category)}>
                          Add Amount
                        </button>
                      )
                    )
                  }
                </span>
                {item.amount !== "" && (
                  <button style={{ marginLeft: "1rem" }} onClick={() => {
                    setEditId(item.id);
                    setEditCategory(item.category);
                    setEditAmount(item.amount);
                  }}>
                    Edit
                  </button>
                )}
                <button style={{ marginLeft: "0.5rem", color: "red" }} onClick={() => handleDelete(item)}>
                  Delete
                </button>
              </div>
            )
          )}
          {showForm && (
            <form
              onSubmit={handleAddItem}
              style={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                placeholder="Category"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                required
                style={{ marginRight: "0.5rem" }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                style={{ marginRight: "0.5rem", width: "80px" }}
              />
              <button type="submit">Add</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ marginLeft: "0.5rem" }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default BudgetSection;
