import express from 'express';
import db from './db.mjs'; // Import your database module

const router = express.Router();

router.post('/posts/:postId/comments', async (req, res) => {
    const { userId, text } = req.body;
    const postId = parseInt(req.params.postId);

    try {
        const postCommentQuery = 'INSERT INTO post_comments (user_id, post_id, comment, created_at, updated_at) VALUES (?,?,?,NOW(),NOW())';
        const values = [userId, postId, text, new Date(), new Date()];

           db.query(postCommentQuery, values, (error, results) => {
            if (error) {
                console.error('Error inserting comment:', error);
                return res.status(500).json({ error: 'Error inserting comment' });
            }

            console.log('Comment inserted successfully:', results);
            res.status(201).json({ message: 'Comment inserted successfully', comment: { userId, postId, text } });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/posts/:postId/comments', async (req, res) => {
    const postId = parseInt(req.params.postId);

    try {
        // SQL query to fetch comments for the given post ID with the first name of the user
        const fetchCommentsQuery = `
            SELECT 
                pc.id AS comment_id,
                pc.post_id,
                pc.comment AS comment_text,
                pc.created_at AS comment_created_at,
                pc.updated_at AS comment_updated_at,
                u.first_name AS user_first_name,
                pc.user_id AS user_id
            FROM 
                post_comments pc
            LEFT JOIN 
                users u ON pc.user_id = u.id
            WHERE 
                pc.post_id = ?
            ORDER BY 
                pc.created_at ASC;
        `;

        // Execute the query
        db.query(fetchCommentsQuery, [postId], (error, results) => {
            if (error) {
                console.error('Error fetching comments:', error);
                return res.status(500).json({ error: 'Error fetching comments' });
            }

            // Respond with the fetched comments including the first name of the user
            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/delete/:commentId', async (req, res) => {
    const commentId = parseInt(req.params.commentId);
    const { userId } = req.body; // The user ID should be provided in the request body

    try {
        // Query to get the user_id of the comment to check if the requesting user is the owner
        const checkOwnershipQuery = 'SELECT user_id FROM post_comments WHERE id = ?';
        db.query(checkOwnershipQuery, [commentId], (error, results) => {
            if (error) {
                console.error('Error checking comment ownership:', error);
                return res.status(500).json({ error: 'Error checking comment ownership' });
            }

            if (results.length === 0) {
                // Comment not found
                return res.status(404).json({ error: 'Comment not found' });
            }

            const commentOwnerId = results[0].user_id;

            if (commentOwnerId !== userId) {
                // If the requesting user is not the owner of the comment, deny deletion
                return res.status(403).json({ error: 'Unauthorized to delete this comment' });
            }

            // Delete the comment
            const deleteCommentQuery = 'DELETE FROM post_comments WHERE id = ?';
            db.query(deleteCommentQuery, [commentId], (error, results) => {
                if (error) {
                    console.error('Error deleting comment:', error);
                    return res.status(500).json({ error: 'Error deleting comment' });
                }

                console.log('Comment deleted successfully');
                res.status(204).end(); // Respond with no content to indicate successful deletion
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;
