import React, { useState, useEffect } from 'react';
import './css/AddExpense.css';
import { useNavigate, useParams } from 'react-router-dom';

const AddExpense = ({ transactions, setTransactions }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [transactionType, setTransactionType] = useState('expense');
    const { id } = useParams();  // Extract transaction ID from the URL params
    const navigate = useNavigate();

    // Fetch the existing transaction details if editing
    useEffect(() => {
        if (id) {
            const transaction = transactions.find((transaction) => transaction._id === id);
            if (transaction) {
                setDescription(transaction.description);
                setAmount(transaction.amount.toString());
                setCategory(transaction.category);
                setTransactionType(transaction.type);
            }
        }
    }, [id, transactions]); // Run only when id or transactions change

    // Add or Update transaction
    const addOrUpdateTransaction = async () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const newTransaction = { description, amount: parsedAmount, category, type: transactionType };

        const method = id ? 'PUT' : 'POST';  // PUT if editing, POST if creating
        const url = id 
            ? `http://localhost:5000/transactions/${id}` // Update the specific transaction
            : 'http://localhost:5000/transactions'; // Create new transaction

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTransaction),
            });
            const data = await response.json();

            if (response.ok) {
                // If it's an edit, update the specific transaction in the state
                if (id) {
                    setTransactions((prevTransactions) =>
                        prevTransactions.map((transaction) =>
                            transaction._id === id ? { ...transaction, ...data } : transaction
                        )
                    );
                } else {
                    // If it's a new transaction, just add it
                    setTransactions((prevTransactions) => [...prevTransactions, data]);
                }

                // Navigate back to the transaction history page
                navigate('/transactionhistory');
            } else {
                alert('Error saving transaction');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const navigateToHome = () => {
        navigate('/');
    };

    return (
        <div className="window-container">
            <div className="add-expense-container">
                <h1>{id ? 'Edit Transaction' : 'Add Transaction'}</h1>
                <form className="add-expense-form">
                    <div className="form-field">
                        <label htmlFor="description" className={description ? 'has-value' : ''}>Description</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="amount" className={amount ? 'has-value' : ''}>Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="category" className={category ? 'has-value' : ''}>Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Food">Food</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Health">Health</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="transactionType" className={transactionType ? 'has-value' : ''}>Type</label>
                        <select
                            id="transactionType"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    <button type="button" onClick={addOrUpdateTransaction}>
                        {id ? 'Update Transaction' : 'Add Transaction'}
                    </button>
                </form>

                <button onClick={navigateToHome} className="home-button">Home</button>
            </div>
        </div>
    );
};

export default AddExpense;
