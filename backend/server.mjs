import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRouter from './authRouter.mjs'; 
import postRouter from './postRouter.mjs';
import commentRouter from './commentRouter.mjs';
import forumMessageRouter from './forumMessageRouter.mjs';

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.static('Public'));
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false,
    }
}));

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/forum', forumMessageRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
