import { useState } from "react";

function BudgetSection({ title, presetCategories = [] }) {
  const [isOpen, setIsOpen] = useState(true);
  // Start with preset categories, each with editable category and amount
  const [items, setItems] = useState(
    presetCategories.map((cat) => ({
      id: Date.now() + Math.random(),
      category: cat,
      amount: "",
      isEditing: false,
    }))
  );
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const toggleOpen = () => setIsOpen(!isOpen);

  // Edit handlers
  const handleEdit = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isEditing: true } : item
      )
    );
  };

  const handleSave = (id, category, amount) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, category, amount, isEditing: false }
          : item
      )
    );
  };

  const handleCancel = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isEditing: false } : item
      )
    );
  };

  // Add new item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newCategory || !newAmount) return;
    setItems([
      ...items,
      {
        id: Date.now() + Math.random(),
        category: newCategory,
        amount: parseFloat(newAmount),
        isEditing: false,
      },
    ]);
    setNewCategory("");
    setNewAmount("");
    setShowForm(false);
  };

  return (
    <div className="budget-section">
      <div
        className="section-header"
        onClick={toggleOpen}
        style={{ display: "flex", alignItems: "center" }}
      >
        <h2 style={{ flex: 1 }}>{title}</h2>
        <span className="arrow">{isOpen ? "⌄" : "⌃"}</span>
        <button
          className="black-button"
          style={{ marginLeft: "1rem" }}
          onClick={(e) => {
            e.stopPropagation();
            setShowForm(true);
          }}
        >
          Add Item
        </button>
      </div>

      {isOpen && (
        <div className="section-content">
          {items.map((item) =>
            item.isEditing ? (
              <form
                key={item.id}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(item.id, item.category, item.amount);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) =>
                    setItems(
                      items.map((i) =>
                        i.id === item.id
                          ? { ...i, category: e.target.value }
                          : i
                      )
                    )
                  }
                  required
                  style={{ marginRight: "0.5rem" }}
                />
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) =>
                    setItems(
                      items.map((i) =>
                        i.id === item.id ? { ...i, amount: e.target.value } : i
                      )
                    )
                  }
                  required
                  min="0"
                  step="0.01"
                  style={{ marginRight: "0.5rem", width: "80px" }}
                />
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={() => handleCancel(item.id)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div
                className="budget-item"
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ flex: 1 }}>{item.category}</span>
                <span style={{ marginLeft: "1rem", minWidth: "80px" }}>
                  {item.amount !== ""
                    ? `$${Number(item.amount).toFixed(2)}`
                    : "No Amount"}
                </span>
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => handleEdit(item.id)}
                >
                  Edit
                </button>
              </div>
            )
          )}
          {showForm && (
            <form
              onSubmit={handleAddItem}
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                style={{ marginRight: "0.5rem" }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
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
