import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Components/Styling/Forum.css';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import axios from 'axios';

const CommunityForum = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fetchMessagesData, setFetchMessagesData] = useState([])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:3000/forum/getMessages');
                
                if (response.status === 200) {
                    setFetchMessagesData(response.data);
                } else {
                    console.error('Error fetching messages:', response.status);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
    
        fetchMessages();
    }, [message]);
    
    useEffect(() => {
        const storedUserData = localStorage.getItem('activeUser');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        } else {
            navigate('/signin');
        }
    }, [navigate]);

    const capitalizeFirstLetter = (str) => {
        return str && typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str;
    };

    const messageSchema = yup.object().shape({
        message: yup.string().required('Message cannot be empty'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate the form data
            await messageSchema.validate({ message });
    
            const userId = userData?.data?.activeUser?.id;

            const response = await axios.post('http://localhost:3000/forum/message',{ message, userId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                setMessage('');
                setErrorMessage('');
            } else {
                setErrorMessage('Error sending message. Please try again.');
            }
        } catch (err) {
            setErrorMessage(err.message);
    
            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
        }
    };

    const handleDelete = async (messageId) => {
        if (userData && userData.data && userData.data.activeUser) {
            const userId = userData.data.activeUser.id;
            try {
                const response = await axios.delete(`http://localhost:3000/forum/deleteMessage/${messageId}`, {
                    data: { userId }
                });
    
                if (response.status === 200) {
                    setFetchMessagesData(fetchMessagesData.filter(msg => msg.id !== messageId));
                } else {
                    console.error('Error deleting message:', response.status);
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        } else {
            console.error('User ID not defined');
        }
    };
    

    return (
        <div className='container'>
            <div className="welcome-message container mt-5">
                <h1 className='text-center'>Welcome to the Barangay Community Forum!</h1>
                <div className="forumrules">
                    <ul>
                        <li>Be respectful to all members. Avoid personal attacks, harassment, or hate speech.</li>
                        <li>Refrain from using offensive, vulgar, or obscene language.</li>
                        <li>Do not share or promote malicious links, viruses, or malware.</li>
                        <li>Avoid posting unsolicited advertisements or spam.</li>
                        <li>Stay on topic and keep discussions relevant.</li>
                        <li>Do not share personal information such as addresses, phone numbers, or email addresses.</li>
                        <li>Respect copyright laws and provide proper attribution when sharing copyrighted content.</li>
                        <li>Use the forum's reporting mechanism to report any inappropriate behavior.</li>
                    </ul>
                </div>
            </div>
            <div className='forumContainer p-3 mt-5'>
                <h5 className='mb-3'><span>ADMIN: </span> We're glad you're here! This is a place where our community members can connect, share ideas, and engage in meaningful discussions about our barangay and its activities.</h5>
                {/* Add forum content here */}
                {fetchMessagesData.length > 0 ? (
                    fetchMessagesData.map((msg, index) => (
                        <div key={index} className="message">
                            <p>{msg.first_name.toUpperCase()}<span className='messageDate'>{new Date(msg.created_at).toLocaleString()}</span></p>
                            <p className='messageContent'>{msg.message}</p>
                            {msg.user_id === userData?.data?.activeUser?.id && (
                            <button onClick={() => handleDelete(msg.id)} className='btn btn-danger btn-sm'>Delete</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
            <Form className='forumForm mt-3' onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="comment">
                    <div className="input-group">
                        <Form.Control 
                            type="text" 
                            placeholder={`Message as ${capitalizeFirstLetter(userData?.data.activeUser.first_name)}`} 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                        >
                            Send
                        </button>
                    </div>
                </Form.Group>
                {/* Render error message if it exists */}
                {errorMessage && (
                    <div className="text-danger mb-3">
                        {errorMessage}
                    </div>
                )}
            </Form>
        </div>
    );
};

export default CommunityForum;
