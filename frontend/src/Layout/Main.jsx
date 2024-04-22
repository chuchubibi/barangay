import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/footer'; 

const MainLayout = () => {
    const location = useLocation();
    const showHeader = location.pathname !== '/' && location.pathname !== '/signin';
    const showFooter = location.pathname !== '/' && location.pathname !== '/signin';

    return (
        <div className='container-fluid'>
            {showHeader && <Header />}
            <Outlet />
            {showFooter && <Footer />}
        </div>
    );
}

export default MainLayout;
