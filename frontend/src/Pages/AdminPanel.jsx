import { useState } from 'react';
import axios from 'axios';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';

const AdminPanel = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...selectedFiles]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

        // Append all images to the form data
        images.forEach((image) => {
            formData.append(`image`, image);
        });

        try {
            const response = await axios.post('http://localhost:3000/posts/admin/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            console.log('Post created successfully');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
            <FormGroup>
                <FormLabel>Title</FormLabel>
                <FormControl
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormControl
                    as="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Images</FormLabel>
                <FormControl
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
            </FormGroup>
            <Button type="submit">Create Post</Button>
        </Form>
        </>
    );
};

export default AdminPanel;
