import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from '../src/Layout/Main';
import LandingPage from '../src/Pages/LandingPage';
import HomePage from '../src/Pages/HomePage';
import SigninPage from '../src/Pages/SigninPage';
import AdminPanel from '../src/Pages/AdminPanel';
import CommunityForum from '../src/Pages/CommunityForum';
import Hotlines from '../src/Pages/Hotlines';
import Indigency from '../src/Pages/Indigency';
import NotFoundPage from '../src/Pages/NotFoundPage';

function App() {
	const [showNotification, setShowNotification] = useState(false);
	useEffect(() => {
        // Event handler for keydown event to disable developer tools shortcuts
        const handleKeydown = (event) => {
            if (
                (event.ctrlKey && event.shiftKey && event.key === 'I') ||
                event.key === 'F12' ||
                (event.ctrlKey && event.shiftKey && event.key === 'C')
            ) {
                event.preventDefault();
                event.stopPropagation();
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 2000);
            }
        };

        // Event handler for contextmenu event to prevent right-clicking
        const handleRightClick = (event) => {
            event.preventDefault();
			setShowNotification(true); // Show the notification

			// Hide the notification after 2 seconds
			setTimeout(() => {
				setShowNotification(false);
			}, 2000);
        };

        // Add event listeners to the document
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('contextmenu', handleRightClick);

        // Cleanup function to remove event listeners when component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path='/' element={<MainLayout />}>
				<Route index element={<LandingPage />}/>
				<Route path='/signin' element={<SigninPage />}/>
				<Route path='/home' element={<HomePage />}/>
				<Route path='/admin' element={<AdminPanel />}/>
				<Route path='/communityForum' element={<CommunityForum />}/>
				<Route path='/hotlines' element={<Hotlines />}/>
				<Route path='/indigency' element={<Indigency />}/>

                <Route path='*' element={<NotFoundPage />} />
			</Route>

		)
	);

	return (
		<>
			<RouterProvider router={router} />
			{/* Custom notification display */}
            {showNotification && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    padding: '10px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '5px'
                }}>
                    Developer tools are disabled.
                </div>
            )}
		</>
	)
}

export default App
