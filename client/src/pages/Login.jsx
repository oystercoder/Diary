import React from 'react'
import image from '../assets/signin.svg'
import axios from 'axios'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const navigate = useNavigate();
    const [_, setCookie] = useCookies(["access_token"]);
    const run = async (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
  
      // Basic client-side validation
      if (!email || !password) {
          alert("Please enter both email and password.");
          return;
      }
  
     
      try {
          const res = await axios.post("http://localhost:3001/auth/login", {
              email,
              status,
              password
          });
  
          // Log email for debugging (avoid logging passwords)
          console.log(res.status)
          
  
          // Check response data for userID
          if (res.status===200) {
              // console.log(res.data.userID);
              // setCookie("access_token", res.data.token);
              // window.localStorage.setItem("userID", res.data.userID);
              navigate("/home");
  
              alert("Success in login");
              setCookie("access_token", res.data.token);
              setEmail("");
              setPassword("");
          } else {
              alert("Login failed. Please check your credentials.");
          }
      } catch (error) {
          const message = error.response 
              ? error.response.data.message 
              : "Network error. Please try again.";
          alert(message);
      }
  };
  
  
  
  return (
    <>
    {/* <div className='flex flex-row'>
    <div className='w-1/2'>
        
        <p className='mb-5'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat numquam recusandae quibusdam.
        </p>
        <img className='' src={image} alt="Description of the image" />

    </div>
    <div class="mt-20 w-1 bg-gray-400 h-screen overflow-y-hidden"></div>

    
    <div className='w-1/2'>
    <h2 className=' mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2'>Sign In</h2>
   

    </div>
    </div> */}

    {/*
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
*/}

<section className="relative flex flex-wrap lg:h-screen lg:items-center">
<div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
    <img
      alt=""
      src={image}
      className="absolute inset-0 h-full w-full mt-5 "
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

          <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </span>
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

          <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </span>
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
    </>
 
  
  )
}

export default Login
