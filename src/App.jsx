import { useState } from "react";
import BudgetSection from "./Components/BudgetSection";
import "./App.css";

const DEFAULT_CATEGORIES = ["Bills", "Needs", "Wants", "Savings"];
const BILLS_PRESET = ["Music", "Insurance", "Phone", "Internet", "Utilities"];

function App() {
  const [budgetData, setBudgetData] = useState({
    Bills: [],
    Needs: [],
    Wants: [],
    Savings: []
  });

  const addItem = (category, item) => {
    setBudgetData((prev) => ({
      ...prev,
      [category]: [...prev[category], item]
    }));
  };

  return (
    <div className="app">
      <h1>My Budget</h1>
      {DEFAULT_CATEGORIES.map((cat) => (
        <BudgetSection
          key={cat}
          title={cat}
          items={budgetData[cat]}
          onAddItem={(item) => addItem(cat, item)}
          presetCategories={cat === "Bills" ? BILLS_PRESET : []}
        />
      ))}
    </div>
  );
}

export default App;
