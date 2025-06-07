import { useState, useEffect } from "react";
import BudgetSection from "./Components/BudgetSection";
import "./App.css";

const DEFAULT_CATEGORIES = ["Bills", "Needs", "Wants", "Savings"];
const BILLS_PRESET = ["Music", "Insurance", "Phone", "Internet", "Utilities"];
const NEEDS_PRESET = ["Grocceries", "Gas", "Transportation"];
const WANTS_PRESET = ["Entertainment", "Clothes", "Dining Out", "Miscellaneous"];
const SAVINGS_PRESET = ["Investment" , "Emergency Fund", "Short-term Fund"];

function App() {
  // Load from localStorage or use defaults
  const [bankBalance, setBankBalance] = useState(() =>
    localStorage.getItem("bankBalance") || ""
  );
  const [budgetData, setBudgetData] = useState(() => {
    const saved = localStorage.getItem("budgetData");
    return saved
      ? JSON.parse(saved)
      : { Bills: [], Needs: [], Wants: [], Savings: [] };
  });
  const [sessionExpired, setSessionExpired] = useState(false);

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

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("bankBalance", bankBalance);
  }, [bankBalance]);

  useEffect(() => {
    localStorage.setItem("budgetData", JSON.stringify(budgetData));
  }, [budgetData]);

  useEffect(() => {
    // Only set if not already set
    if (!localStorage.getItem("authExpiresAt")) {
      const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour from now
      localStorage.setItem("authExpiresAt", expiresAt);
    }
  }, []);

  useEffect(() => {
    const checkExpiry = () => {
      const expiresAt = localStorage.getItem("authExpiresAt");
      if (expiresAt && Date.now() > Number(expiresAt)) {
        // Session expired
        localStorage.removeItem("authExpiresAt");
        localStorage.removeItem("bankBalance");
        localStorage.removeItem("budgetData");
        setSessionExpired(true);
      }
    };

    checkExpiry(); // Check on mount

    const interval = setInterval(checkExpiry, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (sessionExpired) {
    return (
      <div className="app" style={{ textAlign: "center", marginTop: "5rem" }}>
        <h2>Your session has expired.</h2>
        <p>Please log in again to continue.</p>
      </div>
    );
  }

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
