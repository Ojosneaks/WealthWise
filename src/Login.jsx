import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // Initialize Firebase authentication and navigation
    const auth = getAuth();
    const navigate = useNavigate();
    
    // State variables for managing authentication state, email, password, and error messages
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle sign-in with Google
    const signInWithGoogle = async () => {
        setAuthing(true);
        
        // Use Firebase to sign in with Google
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                if(error.code === "auth/user-not-found"){
                    setError("No google account has been found");
                }
            });
    }

    // Function to handle sign-in with email and password
    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');

        // Use Firebase to sign in with email and password
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                if (error.code === "auth/user-not-found") {
                    setError("No account found with this email.");
                } else if (error.code === "auth/wrong-password") {
                    setError("Incorrect password. Please try again.");
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
                setAuthing(false);
            });
    }

    return (
        <div className='w-full h-screen flex'>
            {/* Left half of the screen - background styling */}
            <div className='w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center'>
            </div>

            {/* Right half of the screen - login form */}
            <div className='w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center'>
                <div className='w-full flex flex-col max-w-[450px] mx-auto'>
                    {/* Header section with title and welcome message */}
                    <div className='w-full flex flex-col mb-10 text-white'>
                        <h3 className='text-4xl font-bold mb-2'>Login</h3>
                        <p className='text-lg mb-4'>Welcome Back! Please enter your details.</p>
                    </div>

                    {/* Input fields for email and password */}
                    <div className='w-full flex flex-col mb-6'>
                        <input
                            type='email'
                            placeholder='Email'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input
                            type='password'
                            placeholder='Password'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    {/* Button to log in with email and password */}
                    <div className='w-full flex flex-col mb-4'>
                        <button
                            className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
                            onClick={signInWithEmail}
                            disabled={authing}>
                            Log In With Email and Password
                        </button>
                    </div>

                    {/* Display error message if there is one */}
                    {error && <div className='text-red-500 mb-4'>{error}</div>}

                    {/* Divider with 'OR' text */}
                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-500'></div>
                        <p className='text-lg absolute text-gray-500 bg-[#1a1a1a] px-2'>OR</p>
                    </div>

                    {/* Button to log in with Google */}
                    <button
                        className='w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-7'
                        onClick={signInWithGoogle}
                        disabled={authing}>
                        Log In With Google
                    </button>
                </div>

                {/* Link to sign up page */}
                <div className='w-full flex items-center justify-center mt-10'>
                    <p className='text-sm font-normal text-gray-400'>Don't have an account? <span className='font-semibold text-white cursor-pointer underline'><a href='/signup'>Sign Up</a></span></p>
                </div>
            </div>
        </div>
    );
}

export default Login;