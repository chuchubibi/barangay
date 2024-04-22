import React, { useState } from 'react';
import LandingPageLogo from '../../src/assets/Images/logobg.png';
import '../Components/Styling/Landing.css';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SigninPage = () => {

    const navigate = useNavigate();

    const [loginStatus, setLoginStatus] = useState(null);

    const validationSchema = yup.object().shape({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const handleLogin = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email: values.email,
                password: values.password
            });
            if (response.data.auth) {
                localStorage.setItem('activeUser', JSON.stringify(response));
                navigate('/home');
            } else {
                setLoginStatus('Invalid Email or Password');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setLoginStatus('Invalid Email or Password');
            } else {
                setLoginStatus('Invalid Email or Password');
            }
        } finally {
            setSubmitting(false);
            setTimeout(() => {
                setLoginStatus(null);
            }, 2000);
        }
    };

    return (
        <>
            <div className='LandingPage'>
                <Row>
                    <Col md={12} lg={5}>
                        <div className='landingPageLogoContainer'>
                            <img className="landingPageLogo" src={LandingPageLogo} alt="Logo Image" />
                            <p>
                                Welcome to the official website of Barangay San Jose! Here, we are dedicated to keeping you informed about the latest news and updates from our vibrant community. From local events to important announcements, we strive to keep you connected to what's happening in Barangay San Jose.
                            </p>
                            <p>
                                But that's not all – our website also offers convenient services to our residents. Need a barangay document? No problem! With our online document request system, you can easily obtain the documents you need from the comfort of your own home.
                            </p>
                            <p>
                                To unlock the full range of services and stay up-to-date with everything happening in Barangay San Jose, we invite you to register with us today. Join our community online and discover all that our barangay has to offer!
                            </p>
                        </div>
                    </Col>
                    <Col md={12} lg={7}>
                        <div className='landingPageForm'>
                            {loginStatus && <p className={loginStatus === 'Successfully logged in' ? 'Success' : 'Failed'}>{loginStatus}</p>}
                            <h1 className='signUp text-center mb-4'>San Jose E-Portal</h1>
                            <Formik
                                initialValues={{
                                    email: '',
                                    password: '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleLogin}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                                                <Form.Control 
                                                    type="email" 
                                                    name="email" 
                                                    placeholder="Enter email" 
                                                    value={values.email} 
                                                    onChange={handleChange} 
                                                    onBlur={handleBlur} 
                                                    autoComplete="off"
                                                />
                                            </InputGroup>
                                            {touched.email && errors.email && <div className="text-danger">{errors.email}</div>}
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text><FaLock /></InputGroup.Text>
                                                <Form.Control 
                                                    type="password" 
                                                    name="password" 
                                                    placeholder="Password" 
                                                    value={values.password} 
                                                    onChange={handleChange} 
                                                    onBlur={handleBlur} 
                                                    autoComplete="off"
                                                />
                                            </InputGroup>
                                            {touched.password && errors.password && <div className="text-danger">{errors.password}</div>}
                                        </Form.Group>
                                        <Button 
                                            type='submit' 
                                            className='signinBtn' 
                                            disabled={isSubmitting}
                                        >
                                            Sign in
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                            <Link to="/" className='atag'>Create an account</Link>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default SigninPage;
