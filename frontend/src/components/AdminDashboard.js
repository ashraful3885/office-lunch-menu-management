import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [lunchItems, setLunchItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [userChoices, setUserChoices] = useState([]);

    useEffect(() => {
        const fetchLunchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/lunch-items', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setLunchItems(response.data);
            } catch (error) {
                console.error('Error fetching lunch items:', error);
            }
        };

        const fetchUserChoices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user-choices', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUserChoices(response.data);
            } catch (error) {
                console.error('Error fetching user choices:', error);
            }
        };

        fetchLunchItems();
        fetchUserChoices();
    }, []);

    const handleAddItem = async () => {
        try {
            await axios.post(
                'http://localhost:5000/api/lunch-items',
                { name: newItemName },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setNewItemName('');
            // Refresh the list of items
            const response = await axios.get('http://localhost:5000/api/lunch-items', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setLunchItems(response.data);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/lunch-items/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Refresh the list of items
            const response = await axios.get('http://localhost:5000/api/lunch-items', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setLunchItems(response.data);
            // Refresh the list of user choices
            const userChoicesResponse = await axios.get('http://localhost:5000/api/user-choices', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUserChoices(userChoicesResponse.data);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <h3>Lunch Items</h3>
            <div>
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Enter new item name"
                />
                <button onClick={handleAddItem}>Add Item</button>
            </div>
            <ul>
                {lunchItems.map((item) => (
                    <li key={item.id}>
                        {item.name}{' '}
                        <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                <h3>User Choices</h3>
                <ul>
                    {userChoices.map((choice) => (
                        <li key={choice.id}>
                            {choice.username} selected {choice.item_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;
