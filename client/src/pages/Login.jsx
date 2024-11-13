import React from 'react';
import image from '../assets/signin.svg';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();
    const [_, setCookie] = useCookies(['access_token']);

    const run = async (e) => {
        e.preventDefault();
        
 // Prevent the default form submission behavior

        // Basic client-side validation
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            // Correctly reference environment variable
            const apiUrl = import.meta.env.VITE_API_URL;
            console.log(apiUrl); // Log API URL for debugging

            const res = await axios.post(`${apiUrl}/auth/login`, {
                email,
                password, // Removed `status` as it wasn't defined in your code
            });

            // Log response status for debugging
            console.log(res.status);

            // Check response data for the token
            if (res.status === 200 && res.data.token) {
                setCookie('access_token', res.data.token, { path: '/' }); // Set cookie with path
                alert('Success in login');
                setEmail('');
                setPassword('');
                navigate('/home');
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            const message = error.response
                ? error.response.data.message
                : 'Network error. Please try again.';
            alert(message);
        }
    };

    return (
        <section className="relative flex flex-wrap lg:h-screen lg:items-center">
            <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
                <img
                    alt=""
                    src={image}
                    className="absolute inset-0 h-full w-full mt-5"
                />
            </div>
            <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>
                    <p className="mt-4 text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque
                        ipsa culpa autem, at itaque nostrum!
                    </p>
                </div>

                <form action="#" onSubmit={run} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Update state on change
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update state on change
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-red-500">
                            <a className="underline" href="/forgot">Forgot Password</a>
                        </p>
                        <button
                            type="submit"
                            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;
