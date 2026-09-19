import { useState, useEffect} from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
  const savedTransactions = localStorage.getItem("transactions");
  return savedTransactions ? JSON.parse(savedTransactions) : [];
});
useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}, [transactions]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const addTransaction = (e) => {
    e.preventDefault();

    if (!title || !amount) {
      alert("Please enter title and amount");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title,
      amount: Number(amount),
      type,
      category,
      date: new Date().toLocaleDateString(),
    };

    setTransactions([...transactions, newTransaction]);
    setTitle("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expenses;
  const categoryTotals = {};

transactions
  .filter((transaction) => transaction.type === "expense")
  .forEach((transaction) => {
    categoryTotals[transaction.category] =
      (categoryTotals[transaction.category] || 0) + transaction.amount;
  });

  return (
    <div className="app">
      <header>
        <h1>💰 Expense Manager</h1>
        <p>Track your income and expenses easily</p>
      </header>

      <section className="summary">
        <div className="card">
  <h3>Transactions</h3>
  <h2>{transactions.length}</h2>
</div>
        <div className="card balance">
          <h3>Balance</h3>
          <h2>₹{balance.toFixed(2)}</h2>
        </div>

        <div className="card income">
          <h3>Income</h3>
          <h2>₹{income.toFixed(2)}</h2>
        </div>

        <div className="card expense">
          <h3>Expenses</h3>
          <h2>₹{expenses.toFixed(2)}</h2>
        </div>
      </section>
      <section className="form-section">
  <h2>📊 Expense by Category</h2>

  {Object.keys(categoryTotals).length === 0 ? (
    <p className="empty">No expense data available.</p>
  ) : (
    Object.entries(categoryTotals).map(([category, total]) => (
      <div className="transaction" key={category}>
        <strong>{category}</strong>
        <strong>₹{total.toFixed(2)}</strong>
      </div>
    ))
  )}
</section>
     <section className="form-section">
      <h2>📊 Expense by Category</h2>

      {Object.keys(categoryTotals).length === 0 ? (
        <p className="empty">No expense data available.</p>
      ) : (
        Object.entries(categoryTotals).map(([category, total]) => (
          <div className="transaction" key={category}>
            <strong>{category}</strong>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
        ))
      )}
    </section>
      <section className="form-section">
        <h2>Add Transaction</h2>

        <form onSubmit={addTransaction}>
          <input
            type="text"
            placeholder="Transaction title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="Food">🍔 Food</option>
  <option value="Travel">🚗 Travel</option>
  <option value="Shopping">🛍️ Shopping</option>
  <option value="Bills">💡 Bills</option>
  <option value="Education">📚 Education</option>
  <option value="Health">🏥 Health</option>
  <option value="Other">📦 Other</option>
</select>

          <button type="submit">Add Transaction</button>
        </form>
      </section>

      <section className="transactions">
  <h2>Transaction History</h2>

  <input
    type="text"
    placeholder="🔎 Search transactions..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-box"
  />
  <select
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
  className="filter-select"
>
  <option value="all">All Transactions</option>
  <option value="income">Income</option>
  <option value="expense">Expenses</option>
</select>
<button
  className="clear-btn"
  onClick={() => {
    if (window.confirm("Are you sure you want to delete all transactions?")) {
      setTransactions([]);
    }
  }}
>
  🗑️ Clear All
</button>

        {transactions.length === 0 ? (
          <p className="empty">No transactions yet.</p>
        ) : (
          transactions
 .filter((transaction) => {
  const matchesSearch =
    transaction.title.toLowerCase().includes(search.toLowerCase()) ||
    transaction.category?.toLowerCase().includes(search.toLowerCase());

  const matchesType =
    filterType === "all" || transaction.type === filterType;

  return matchesSearch && matchesType;
})
  .map((transaction) => (
            <div
              className={`transaction ${transaction.type}`}
              key={transaction.id}
            >
              <div>
                <strong>{transaction.title}</strong>
<p>
  {transaction.type} • {transaction.category}
</p>
<small>{transaction.date}</small>
              </div>

              <div className="transaction-right">
                <span>
                  {transaction.type === "income" ? "+" : "-"}₹
                  {transaction.amount.toFixed(2)}
                </span>

                <button onClick={() => deleteTransaction(transaction.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;