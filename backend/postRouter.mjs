import express from 'express';
import db from './db.mjs'; 
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, './Public/Images');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        }
    }
);

const upload = multer({storage: storage});

router.post('/admin/post', upload.array('image', 4), (req, res) => {
    const { title, description } = req.body;

    db.query(
        'INSERT INTO posts (title, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [title, description],
        (err, result) => {
            if (err) {
                console.error('Error inserting post:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            const postId = result.insertId;

            req.files.forEach((file) => {
                const imagePath = file.path;

                db.query(
                    'INSERT INTO post_images (post_id, image_path, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
                    [postId, imagePath],
                    (err, result) => {
                        if (err) {
                            console.error('Error inserting image:', err);
                            return res.status(500).json({ error: 'Server error' });
                        }
                    }
                );
            });

            res.status(201).json({ message: 'Post created successfully', postId });
        }
    );
});

router.get('/fetchPosts', (req, res) => {
    const query = `
        SELECT p.id, p.title, p.description, p.created_at, p.updated_at, GROUP_CONCAT(pi.image_path) AS image_paths
        FROM posts p
        LEFT JOIN post_images pi ON p.id = pi.post_id
        GROUP BY p.id, p.title, p.description, p.created_at, p.updated_at
        ORDER BY p.created_at DESC
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Server error' });
        } else {
            // Format the results into the expected structure
            const formattedResults = results.map((result) => ({
                id: result.id,
                title: result.title,
                description: result.description,
                created_at: result.created_at,
                updated_at: result.updated_at,
                images: result.image_paths ? result.image_paths.split(',') : []
            }));
            res.status(200).json(formattedResults);
        }
    });
});

export default router;
