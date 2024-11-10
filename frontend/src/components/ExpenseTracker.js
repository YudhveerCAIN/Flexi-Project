import React, { useState, useEffect } from 'react';

const ExpenseTracker = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('General'); // New state for category

    // Fetch transactions from server and calculate balance
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch("http://localhost:5000/transactions");
                const data = await response.json();
                setTransactions(data);

                // Calculate initial balance
                const initialBalance = data.reduce((acc, transaction) => 
                    transaction.type === 'income' 
                        ? acc + transaction.amount 
                        : acc - transaction.amount, 
                    0
                );
                setBalance(initialBalance);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    const addTransaction = async (type) => { // Updated function name to handle both income and expense
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const newTransaction = {
            description,
            amount: parsedAmount,
            category,
            type, // Transaction type ('income' or 'expense')
        };

        try {
            const response = await fetch("http://localhost:5000/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTransaction),
            });

            if (response.ok) {
                const savedTransaction = await response.json();

                // Update balance and transactions
                setTransactions((prevTransactions) => [...prevTransactions, savedTransaction]);
                setBalance((prevBalance) => 
                    type === 'income' ? prevBalance + parsedAmount : prevBalance - parsedAmount
                );

                // Clear form
                setDescription('');
                setAmount('');
                setCategory('General');
            } else {
                alert("Error adding transaction.");
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    return (
        <div className="container">
            <h1>Expense Tracker</h1>
            <div className="balance">
                <h2>
                    Balance: $<span id="balance">{balance.toFixed(2)}</span>
                </h2>
            </div>
            <div className="transactions">
                <h2>Transactions</h2>
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={transaction._id || index}>
                            {`${transaction.description} (${transaction.category}): $${transaction.amount.toFixed(2)} `}
                            <span style={{ color: transaction.type === 'expense' ? 'red' : 'green' }}>
                                {transaction.type}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="add-expense">
                <h2>Add Transaction</h2>
                <form>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <button type="button" onClick={() => addTransaction('expense')}>
                        Add Expense
                    </button>
                    <button type="button" onClick={() => addTransaction('income')}>
                        Add Income
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseTracker;
