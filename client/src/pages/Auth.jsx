// useAuth.js
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const useAuth = () => {
    const [cookies] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for the access token
        if (!cookies.access_token) {
            navigate('/'); // Redirect to login if no token is present
        }
    }, [cookies, navigate]);
};

export default useAuth;
