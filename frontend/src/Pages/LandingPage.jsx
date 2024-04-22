import React, {useState} from 'react';
import LandingPageLogo from '../../src/assets/Images/logobg.png';
import '../Components/Styling/Landing.css';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [registrationStatus, setRegistrationStatus] = useState(null);

    const validationSchema = yup.object().shape({
        firstName: yup.string().required('First name is required cannot be empty!'),
        lastName: yup.string().required('Last name is required cannot be empty!'),
        middleName: yup.string().matches(/^[a-zA-Z\s]*$/, 'Middle name can only contain letters and spaces').nullable(),
        age: yup.number().min(0, 'Age must be a positive number').required('Age is required'),
        placeOfBirth: yup.string().required('Place of Birth is required cannot be empty!'),
        email: yup.string().email('Invalid email').required('Email is required'),
        phoneNumber: yup.string().matches(/^[0-9]+$/, 'Phone number must contain only digits').required('Phone number is required'),
        streetAddress: yup.string().required('Street address is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
    });

    return (
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
                    {registrationStatus && <p className={registrationStatus == 'Successfully registered' ? 'Success' : 'Failed'}>{registrationStatus}</p>}
                        <h1 className='signUp text-center mb-4'>San Jose E-Portal</h1>
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                middleName: '',
                                age: '',
                                placeOfBirth: '',
                                email: '',
                                phoneNumber: '',
                                streetAddress: '',
                                password: '',
                                confirmPassword: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting, setErrors,resetForm }) => {
                                // Handle form submission
                                try {
                                    const response = await axios.post('http://localhost:3000/auth/register', values);
                                    setRegistrationStatus('Successfully registered');
                                    resetForm();
                                    navigate('/signin');
                                } catch (error) {
                                    if (error.response && error.response.status === 409) {
                                        setErrors({ email: 'User is already registered' });
                                    } else {
                                        setRegistrationStatus('Failed');
                                        console.error('Registration failed:', error);
                                    }
                                } finally {
                                    setSubmitting(false);
                                    setTimeout(() => {
                                        setRegistrationStatus(null);
                                    }, 2000);
                                }
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="firstName">
                                                <Form.Label>First name</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="firstName" 
                                                    value={values.firstName} 
                                                    onChange={handleChange} 
                                                    onBlur={handleBlur} 
                                                    autoComplete="off"
                                                />
                                                {touched.firstName && errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="lastName">
                                                <Form.Label>Last name</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="lastName" 
                                                    value={values.lastName} 
                                                    onChange={handleChange} 
                                                    onBlur={handleBlur} 
                                                    autoComplete="off"
                                                />
                                                {touched.lastName && errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="middleName">
                                                <Form.Label>Middle Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="middleName"
                                                    value={values.middleName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    autoComplete="off"
                                                />
                                                {touched.middleName && errors.middleName && (
                                                    <div className="text-danger">{errors.middleName}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="age">
                                                <Form.Label>Age</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="age"
                                                    value={values.age}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    autoComplete="off"
                                                />
                                                {touched.age && errors.age && (
                                                    <div className="text-danger">{errors.age}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="placeOfBirth">
                                                <Form.Label>Place of Birth</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="placeOfBirth" 
                                                        placeholder="Enter email" 
                                                        value={values.placeOfBirth} 
                                                        onChange={handleChange} 
                                                        onBlur={handleBlur} 
                                                        autoComplete="off"
                                                    />
                                                </InputGroup>
                                                {touched.placeOfBirth && errors.placeOfBirth && <div className="text-danger">{errors.placeOfBirth}</div>}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="streetAddress">
                                                <Form.Label>Street Address</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="streetAddress" 
                                                        placeholder="ex. Sitio Parugan blk2" 
                                                        value={values.streetAddress} 
                                                        onChange={handleChange} 
                                                        onBlur={handleBlur} 
                                                        autoComplete="off"
                                                    />
                                                </InputGroup>
                                                {touched.streetAddress && errors.streetAddress && <div className="text-danger">{errors.streetAddress}</div>}
                                            </Form.Group>
                                        </Col>
                                        <Col>
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
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="phoneNumber">
                                                <Form.Label>Phone Number</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaPhone /></InputGroup.Text>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="phoneNumber" 
                                                        placeholder="Enter phone number" 
                                                        value={values.phoneNumber} 
                                                        onChange={handleChange} 
                                                        onBlur={handleBlur} 
                                                        autoComplete="off"
                                                    />
                                                </InputGroup>
                                                {touched.phoneNumber && errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                                        </Form.Group>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
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
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="confirmPassword">
                                                <Form.Label>Confirm password</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaLock /></InputGroup.Text>
                                                    <Form.Control 
                                                        type="password" 
                                                        name="confirmPassword" 
                                                        placeholder="Confirm password" 
                                                        value={values.confirmPassword} 
                                                        onChange={handleChange} 
                                                        onBlur={handleBlur} 
                                                        autoComplete="off"
                                                    />
                                                </InputGroup>
                                                {touched.confirmPassword && errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button 
                                        type='submit' 
                                        className='signupBtn' 
                                        disabled={isSubmitting}
                                    >
                                        Sign up
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                        <Link to="/signin" className='atag'>Already Have an account?</Link>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default LandingPage;
