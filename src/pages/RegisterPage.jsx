import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const server_url=import.meta.env.VITE_SERVER_URL;
    const nameRef=useRef();
    const usernameRef=useRef();
    const passwordRef=useRef();
    const confirmPasswordRef=useRef();

    const [error, setError] = useState("");

    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name=nameRef.current.value;
        const username=usernameRef.current.value;
        const password=passwordRef.current.value;
        const confirmPassword=confirmPasswordRef.current.value;

        if ( password !== confirmPassword ){
            setError("Passwords do not match");
            return;
        }

        setError("");

        try {
            const response = await fetch(`${server_url}/api/auth/register/`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name,username,password}),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration successful!");
                navigate("/login");
            } else {
                setError(data.msg || "Registration failed");
            }
        } catch (err) {
            setError("Network error");
        }
    };

    return (
<div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-100">
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" name="name" placeholder="Name" ref={nameRef}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" required />
            <input type="text" name="username" placeholder="Username" ref={usernameRef}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" required />
            <input type="password" name="password" placeholder="Password" ref={passwordRef}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" ref={confirmPasswordRef}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" required />
            <button type="submit" 
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-600 transition duration-200">
                Register
            </button>
        </form>
    </div>
    
</div>
    );
};

export default Register;