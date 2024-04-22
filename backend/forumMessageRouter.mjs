import express from 'express';
import db from './db.mjs'; // Import your database module'

const router = express.Router();

router.post('/message', async (req, res) => {
    const { message, userId } = req.body;
    try {
        console.log(message);
        console.log('User ID:', userId);
        const messageQuery = `INSERT INTO messages 
        (
            user_id, 
            message, 
            created_at, 
            updated_at
        ) VALUES (?, ?, ?, ?)`;
        const values = [userId, message, new Date(), new Date()];

        db.query(messageQuery, values, (error, results) => {
            if (error) {
                console.error('Error inserting message:', error);
                return res.status(500).json({ error: 'Error inserting comment' });
            }

            console.log('Message inserted successfully:', results);
            res.status(200).json({ message: 'Comment inserted successfully' });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/getMessages', (req, res) => {
    try {
        const fetchMessagesQuery = `
            SELECT 
                messages.*, users.first_name
            FROM 
                messages
            LEFT JOIN 
                users ON messages.user_id = users.id
            ORDER BY 
                messages.created_at DESC;
        `;

        // Execute the query
        db.query(fetchMessagesQuery, (error, results) => {
            if (error) {
                console.error('Error fetching messages:', error);
                return res.status(500).json({ error: 'Error fetching messages' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/deleteMessage/:id', async (req, res) => {
    const messageId = req.params.id;
    const userId = req.body.userId;

    try {
        const query = `DELETE FROM messages WHERE id = ? AND user_id = ?`;
        const result = db.query(query, [messageId, userId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Message not found or user not authorized' });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});



export default router;