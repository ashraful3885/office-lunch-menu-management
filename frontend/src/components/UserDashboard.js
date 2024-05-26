import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard() {
    const [lunchItems, setLunchItems] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLunchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('You must be logged in to view lunch items.');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/lunch-items', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLunchItems(response.data);
            } catch (error) {
                console.error('Error fetching lunch items:', error);
                setMessage('Error fetching lunch items. Please try again later.');
            }
        };

        fetchLunchItems();
    }, []);

    const handleItemSelect = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('You must be logged in to select an item.');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/user/select-item',
                { itemId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error selecting item:', error);
            setMessage('Error selecting item. Please try again.');
        }
    };

    return (
        <div>
            <h2>Lunch Items</h2>
            <ul>
                {lunchItems.map((item) => (
                    <li key={item.id}>
                        {item.name}{' '}
                        <button onClick={() => handleItemSelect(item.id)}>Select</button>
                    </li>
                ))}
            </ul>
            {message && <p>{message}</p>}
        </div>
    );
}

export default UserDashboard;
