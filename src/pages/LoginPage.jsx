import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const server_url=import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");


    // we not do this because chatGpt said and i also see that it trigger loop and unknown behavior and no navigate run
    //  chatGpt :- “UseEffect runs again and again until navigate() changes the route to / but it not navigate to /. The useEffect runs because of the state change, so don’t run navigate in the useEffect during a state re-render.”
    // useEffect(()=>{
    //     const jwt=localStorage.getItem("Authorization");
    //     if(jwt){
    //         navigate("/",{replace:true}); // to home page
    //     }
    // },[navigate])
    // useEffect(()=>{
    //     console.log(isJwtSet);
    //     if(isJwtSet){
    //         navigate("/",{replace:true}); // to home page
    //     }
    // },[isJwtSet,navigate])

    const handleSubmit=async (e)=>{
        e.preventDefault();

        const username=usernameRef.current.value;
        const password=passwordRef.current.value;

        setError("");

        try{
            const response=await fetch(`${server_url}/api/auth/login/`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({username,password}),
            });

            const data=await response.json();

            if(response.ok && data.Authorization){
                localStorage.setItem("Authorization",JSON.stringify(data.Authorization));
                navigate("/",{replace:true});
                // instead i called dispatch of redux before so all wrong/not_load/problem handle by it so on homepage all run correct
            }else{
                setError(data.msg || "invalid username/password");
            }
        }
        catch(e){
            setError("Network error");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="text" name="username" placeholder="Username" ref={usernameRef}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" required />
                    <input type="password" name="password" placeholder="Password" ref={passwordRef}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" required />
                    <button type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-600 transition duration-200">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;