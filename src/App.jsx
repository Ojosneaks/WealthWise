import { useState } from "react";
import BudgetSection from "./Components/BudgetSection";
import "./App.css";

const DEFAULT_CATEGORIES = ["Bills", "Needs", "Wants", "Savings"];
const BILLS_PRESET = ["Music", "Insurance", "Phone", "Internet", "Utilities"];
const NEEDS_PRESET = ["Grocceries", "Gas", "Transportation"];
const WANTS_PRESET = ["Entertainment", "Clothes", "Dining Out", "Miscellaneous"];
const SAVINGS_PRESET = ["Investment" , "Emergency Fund", "Short-term Fund"];

function App() {
  const [bankBalance, setBankBalance] = useState("");
  const [budgetData, setBudgetData] = useState({
    Bills: [],
    Needs: [],
    Wants: [],
    Savings: []
  });

  // Calculate total assigned
  const totalAssigned = Object.values(budgetData)
    .flat()
    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const unassigned = (parseFloat(bankBalance) || 0) - totalAssigned;

  const addItem = (category, item) => {
    setBudgetData((prev) => ({
      ...prev,
      [category]: [...prev[category], item]
    }));
  };

  const editItem = (category, id, updates) => {
    setBudgetData(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteItem = (category, id) => {
    setBudgetData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  return (
    <div className="app">
      <div className="budget-header">
        <h1>My Budget</h1>
        <div className="bank-balance-summary">
          <div className="bank-balance">
            <label>
              Bank Balance: $
              <input
                type="number"
                value={bankBalance}
                onChange={e => setBankBalance(e.target.value)}
                min="0"
                step="0.01"
                style={{ marginLeft: "0.5rem", width: "120px" }}
              />
            </label>
          </div>
          <div className="balance-numbers">
            <div>
              <span className="balance-label">Assigned</span>
              <span className="balance-value assigned">${totalAssigned.toFixed(2)}</span>
            </div>
            <div>
              <span className="balance-label">Unassigned</span>
              <span className="balance-value unassigned">${unassigned.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {DEFAULT_CATEGORIES.map((cat) => {
        const categoryTotal = budgetData[cat].reduce(
          (sum, item) => sum + (parseFloat(item.amount) || 0),
          0
        );
        return (
          <BudgetSection
            key={cat}
            title={cat}
            items={budgetData[cat]}
            onAddItem={item => addItem(cat, item)}
            onEditItem={(id, updates) => editItem(cat, id, updates)}
            onDeleteItem={id => deleteItem(cat, id)}
            presetCategories={
              cat === "Bills" ? BILLS_PRESET :
              cat === "Needs" ? NEEDS_PRESET :
              cat === "Wants" ? WANTS_PRESET :
              cat === "Savings" ? SAVINGS_PRESET :
              []
            }
            categoryTotal={categoryTotal}
          />
        );
      })}
    </div>
  );
}

export default App;
