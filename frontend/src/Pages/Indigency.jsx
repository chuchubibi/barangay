import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Form from 'react-bootstrap/Form';
import BrgyLogo from '../assets/Images/logobg.png';
import AntipoloLogo from '../assets/Images/antipoloLogo.png';
import '../Components/Styling/Indigency.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Indigency = () => {
    const documentRef = useRef(null);
    const [currentDay, setCurrentDay] = useState('');
    const [currentMonth, setCurrentMonth] = useState('');
    const [currentYear, setCurrentYear] = useState('');
    const [purpose, setPurpose] = useState('ex.( FINANCIAL ASSISTANCE )');

    useEffect(() => {
        const today = new Date();
        const day = today.getDate();
        const month = today.toLocaleString('default', { month: 'long' }).toUpperCase();
        const year = today.getFullYear();

        setCurrentDay(day);
        setCurrentMonth(month);
        setCurrentYear(year);
    }, []);

    const handleDownload = async () => {
        // Capture the JSX element as an image using html2canvas
        const canvas = await html2canvas(documentRef.current);
        const imgData = canvas.toDataURL('image/png');

        // Convert the image to PDF using jsPDF
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

        // Download the PDF
        pdf.save('Barangay_Indigency_Document.pdf');
    };

    const storedUserDataString = localStorage.getItem('activeUser');
    const storedUserData = JSON.parse(storedUserDataString);
    const fullName = `${storedUserData.data.activeUser.first_name} ${storedUserData.data.activeUser.last_name}`.toLocaleUpperCase();
    const middleName = `${storedUserData.data.activeUser.middle_name}`.toLocaleUpperCase();
    const placeOfBirth = `${storedUserData.data.activeUser.place_of_birth}`.toLocaleUpperCase();
    const address = `${storedUserData.data.activeUser.street_address}`.toLocaleUpperCase();

    return (
        <div className='container mainContainer'>
            <Form className='indigencyForm'>
                <Form.Group className="mb-3" controlId="purposeInput">
                    <Form.Label>Purpose: </Form.Label>
                    <Form.Text className="text-muted mx-3">
                        Please specify the purpose for your documentation request.
                    </Form.Text>
                    <Form.Control
                        type="text"
                        placeholder="Enter purpose"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                    />
                </Form.Group>
            </Form>
            <div className='indigencyContainer p-1'>
                <div ref={documentRef} className='indigencyDocument'>
                    <header className='documentHeader'>
                        <img className='indigencyLogo' src={BrgyLogo} alt="Barangay Logo" />
                    <div>
                        <p className='headerP'>Republic of the Philippines</p>
                        <p className='headerP'>Province of Rizal</p>
                        <p className='headerP'>City of Antipolo</p>
                        <h2 className='headerh2'>BARANGAY SAN JOSE</h2>
                        <h5>Office of the Punong Barangay</h5>
                    </div>
                        <img className='indigencyLogo' src={AntipoloLogo} alt="Antipolo Logo" />
                    </header> 
                    <section>
                        <h1 className='indigencyH1'>BARANGAY INDIGENCY</h1>
                        <div className='indigencyContent'>
                            <p>This is to certify that Mr./Ms. <span className='fullname'>{fullName }</span> Y' <span className='middlename'>{middleName},</span></p>
                            <p><span className='age'>{storedUserData.data.activeUser.age},</span> years of age, Filipino citizen, ( ) single ( ) married, Born at <span className='placeOfBirth'>{placeOfBirth}</span></p>
                            <p>and presently residing at <span className='streetAddress'>{address}</span></p>
                            <p>Barangay San Jose, Antipolo City, who is personally known to me belong to indigent family</p>
                            <p> in this Barangay.</p>
                            <div className='indigencyContentInner'>
                                <p>This certification is issued upon the request of the subject-person this <span className='day'>{currentDay}</span> day of</p>
                                <p><span className='month'>{currentMonth}</span>, <span className='year'>{currentYear}</span> at barangay San Jose, Antipolo City, for</p>
                                <p><span className='purpose'>{purpose.toLocaleUpperCase()}</span> and whatever legal purpose it may server.</p> 
                            </div>
                            <div className='signatureSection'>
                                <p className='specimen'>Specimen Signature:</p>
                                <div className='signatures'>
                                    <div className='kagawadSection'>
                                        <h6>By authority of Punong Barangay:</h6>
                                        <p>________________________</p>
                                        <h5 className='kagawad text-center'>Hon. Juan Dela Cruz</h5>
                                        <h6 className='text-center'>Barangay Kagawad</h6>
                                    </div>
                                    <div className='punongBarangay'>
                                        <h4 className='indigencyh4 text-center'>John Pedro Smith Doe</h4>
                                        <p className='text-center'>Punong Barangay</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer>
                        <p className='text-center validationDate'>Not valid without Official Barangay Dry Seal. Valid for 3 months from date of issue.</p>
                        <div className='footerSection d-flex'>
                            <img className='footerLogo' src={AntipoloLogo} alt="Logo for footer" />
                            <div className='contactFooter'>
                                <p>Sen. Lorenzo Sumulong Circle, Sitio Pulong Banal, Barangay San Jose, Antiplo City 1870</p>
                                <ul className='indigencyUl d-flex'>
                                    <li>
                                        <i className="bi bi-telephone-fill"></i> (02) 8234-0378
                                    </li>
                                    <li>
                                        <i className="bi bi-envelope-fill"></i> barangaysanjose@gmail.com
                                    </li>
                                    <li>
                                        <i className="bi bi-facebook"></i> /juandelacruz
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </footer>
                </div>
            </div>
            {/* Buttons for downloading the document and showing the preview */}
            <button className='downlodBtn btn btn-primary' onClick={handleDownload}>Download Document</button>
        </div>
    );
}

export default Indigency;
