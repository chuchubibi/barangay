import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import '../Components/Styling/Homepage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';

const HomePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [postComment, setPostComment] = useState('');

    // Fetch posts and comments
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/posts/fetchPosts');
                setPosts(response.data);
                
                // Fetch comments for each post after fetching posts
                response.data.forEach((post) => {
                    fetchComments(post.id);
                });
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    // Check stored user data
    useEffect(() => {
        const storedUserData = localStorage.getItem('activeUser');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        } else {
            navigate('/signin');
        }
    }, [navigate]);

    const baseURL = 'http://localhost:3000/';

    // Adjust image path
    const adjustImagePath = (path) => {
        return path.replace(/\\/g, '/').replace(/^Public\/Images\//, '');
    };

    // Fetch comments for each post
    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/comments/posts/${postId}/comments`);
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: response.data,
            }));
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
        }
    };

    // Submit a new comment
    const handleSubmit = async (e, postId, userId) => {
        e.preventDefault();
        try {
            const url = `http://localhost:3000/comments/posts/${postId}/comments`;

            const postCommentData = {
                text: postComment,
                userId: userId,
            };
            const response = await axios.post(url, postCommentData);
            
            setPostComment('');

            // Refresh comments after submitting a new comment
            fetchComments(postId);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    // Delete a comment
    const handleDelete = async (commentId, postId) => {
        try {
            const url = `http://localhost:3000/comments/delete/${commentId}`;
            
            const data = {
                userId: userData.data.activeUser.id, 
            };
    
            const response = await axios.delete(url, { data });
    
            // Refresh comments after deleting a comment
            fetchComments(postId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Capitalize the first letter of a string
    function capitalizeFirstLetter(str) {
        if (str && typeof str === 'string') {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return str;
    }

    const handleReactions = () => {
        console.log('reaction is clicked');
    }
    return (
        <>
            <div className='mt-5 container homeContainer'>
                {posts.map((post) => (
                    <div className='postContainer' key={post.id}>
                        <h2 className='d-inline-block title'>{post.title}</h2>
                        <span className='d-inline-block'>
                            {format(new Date(post.created_at), 'MMMM d, yyyy h:mm a')}
                        </span>
                        <h4 className='mb-4 mx-3'>{post.description}</h4>
                        <Container>
                            <Row>
                                {post.images.map((image, index) => (
                                    <Col xs={6} md={3} key={index}>
                                        <Image
                                            thumbnail
                                            src={`${baseURL}Images/${adjustImagePath(image)}`}
                                            alt={post.title}
                                            className='homeImages'
                                        />
                                    </Col>
                                ))}
                            </Row>
                            <div>
                                <button className='postBtn' onClick={() => handleReactions(post.id, 'like')}>
                                    ❤️
                                </button>
                                <button className='postBtn' onClick={() => handleReactions(post.id, 'heart')}>
                                    😍
                                </button>
                                <button className='postBtn' onClick={() => handleReactions(post.id, 'sad')}>
                                    😢
                                </button>
                                <button className='postBtn' onClick={() => handleReactions(post.id, 'angry')}>
                                    😠
                                </button>
                            </div>
                            <div className='d-flex'>
                                <p className='reactCount'>❤️ <span>0</span></p>
                                <p className='reactCount'>😍 <span>0</span></p>
                                <p className='reactCount'>😢 <span>0</span></p>
                                <p className='reactCount'>😠 <span>0</span></p>
                            </div>
                            {/* Comment form */}
                            <Form onSubmit={(e) => handleSubmit(e, post.id, userData.data.activeUser.id)}>
                                <Form.Group className="mb-3" controlId="comment">
                                    <Form.Label><h4>Comment</h4></Form.Label>
                                    <div className="input-group">
                                        <Form.Control 
                                            type="text" 
                                            placeholder={`Comment as ${capitalizeFirstLetter(userData.data.activeUser.first_name)}`}
                                            value={postComment}
                                            onChange={(e) => setPostComment(e.target.value)}
                                        />
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </Form.Group>
                            </Form>
                            {/* Render comments for each post */}
                            {comments[post.id] && (
                            <div className="comments-section">
                                {comments[post.id].map((comment) => (
                                    <div key={comment.comment_id} className="commentContainer">
                                        <div className='d-flex justify-content-between'>
                                            <p className='username'>{capitalizeFirstLetter(comment.user_first_name)}</p>
                                            <span className='date'>
                                                {(() => {
                                                    try {
                                                        return format(new Date(comment.comment_created_at), 'MMMM d, yyyy h:mm a');
                                                    } catch (e) {
                                                        console.error('Invalid date format:', comment.comment_created_at);
                                                        return 'Invalid date';
                                                    }
                                                })()}
                                            </span>
                                        </div>
                                        <p className='comment'>{comment.comment_text}</p>
                                        {/* Add delete button if the current user is the owner of the comment */}
                                        {comment.user_id === userData.data.activeUser.id && (
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(comment.comment_id, post.id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    ))}
                                </div>
                            )}

                        </Container>
                    </div>
                ))}
            </div>
        </>
    );
};

export default HomePage;
