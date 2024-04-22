import React from 'react';
import '../Components/Styling/footer.css';

const footer = () => {
    return (
        <>
            <ul className='d-flex footerMenu p-1'>
                <li>
                    <a href=""><i className="bi bi-telephone-fill"></i> (02) 8234-0378</a>
                </li>
                <li>
                    <a href=""><i className="bi bi-envelope-fill"></i> barangaysanjose@gmail.com</a>
                </li>
                <li>
                    <a href=""><i className="bi bi-facebook"></i> /juandelacruz</a>
                </li>
            </ul>
            <p className='text-center mb-3'>&copy; 2024 Barangay Website. All rights reserved.</p>
        </>
    )
}

export default footer