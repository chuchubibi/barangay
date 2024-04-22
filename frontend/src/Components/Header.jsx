import React, { useEffect, useState } from 'react';
import Logo from '../assets/Images/logobg.png';
import { NavLink } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import '../Components/Styling/Header.css';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('activeUser');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        } 
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('activeUser');
        navigate('/signin');
    };

    const adminPanel = () => {
        navigate('/admin');
    };

    function capitalizeFirstLetter(str) {
        if (str && typeof str === 'string') {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return str;
    }

    return (
        <>
            <Navbar className='headerNav' expand="lg px-4">
                <img className='barangayLogo' src={Logo} alt="Barangay logo" />
                <Navbar.Brand as={NavLink} to='/home' className="me-auto brand m-3">San Jose E-Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto menu">
                    <NavLink className='navlink' to='/home' exact={true.toString()}>Home</NavLink>
                    <NavLink className='navlink' to='/communityForum'>Community Forum</NavLink>
                    <NavDropdown title="Services" id="basic-nav-dropdown">
                        <Dropdown.Item as={NavLink} to='/indigency'>Barangay Indigency</Dropdown.Item>
                        <Dropdown.Item as={NavLink} to='/barangay-clearances'>Barangay Clearance</Dropdown.Item>
                        <Dropdown.Item as={NavLink} to='/permits'>Permits</Dropdown.Item>
                        <Dropdown.Item as={NavLink} to='/certificates'>Certificates</Dropdown.Item>
                        <Dropdown.Item as={NavLink} to='/assistance-programs'>Assistance Programs</Dropdown.Item>
                        <Dropdown.Item as={NavLink} to='/com'>Community Services</Dropdown.Item>
                    </NavDropdown>
                    {userData && (
                        <>
                            <NavDropdown title={`${capitalizeFirstLetter(userData.data.activeUser.first_name)}`} id='lastmenu'>
                                {userData.data.activeUser.role == 'admin' && (
                                    <Dropdown.Item className='logout'><p onClick={adminPanel}>Admin panel</p></Dropdown.Item>
                                )}
                                <Dropdown.Item className='logout'><p onClick={handleLogout}>Log out</p></Dropdown.Item>
                            </NavDropdown>
                        </>
                    )}
                    <NavLink className='navlink' to='/hotlines'>Hotlines</NavLink>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default Header;
