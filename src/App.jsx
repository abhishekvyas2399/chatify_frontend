import {Routes, Route} from "react-router-dom";
import { lazy, Suspense } from "react";
const Register=lazy(()=>import("./pages/RegisterPage"));
const Login=lazy(()=>import("./pages/LoginPage"));
const Chatpage=lazy(()=>import("./pages/ChatPage"));
const MessagePage=lazy(()=>import("./pages/MessagePage"));


import Loading from "./component/static/Loading";
import Appbar from "./component/Appbar";
import Homepage from "./pages/HomePage";

// ***** chatGPT *****
// In JavaScript, functions follow closure properties, meaning they capture variables from their surrounding scope.
// 1.	Functions in useEffect rely on closures → If a function inside useEffect captures an outdated value, it might behave incorrectly.
// 2.	To avoid using stale functions, we put them in the dependency array so React re-creates them when needed.
// 	•	We put dispatch in [] because, if it ever changes, we need to update our function.
//  •	We put functions like loadEverything in [] because they depend on dispatch and should always have the latest version.
//  •	Not just state & props go in [], but also functions or any value that might affect execution due to closures.



// 🔁 Full React Execution Flow:

// 1. Module Load Phase (One-Time Execution)
// 	•	Before any component renders, React (via Webpack/Vite) loads all modules.
// 	•	Each module is executed once.
// 	•	All import/export, context providers, and constants are initialized.
// 	•	This is when things like const socket = io() or createContext() are run.

// 2. Render Phase
// 	•	React starts rendering from the root component (<App />) provided to ReactDOM.createRoot(...).render(<App/>).
// 	•	Whenever a component is rendered:
// 	•	It executes its function body.
// 	•	Runs useState, useEffect, etc., in the order defined.

// 3. Commit Phase
// 	•	React updates the real DOM based on what was returned by your components.
// 	•	Side effects inside useEffect run after the DOM is updated.

// ⸻

// 🔁 What Triggers Re-renders?
// 	•	Props Change: Parent passes new data.
// 	•	State Change: useState updates.
// 	•	Context Change: Any change in context triggers re-render in all subscribers.
// 	•	Redux Store Change: Causes re-render if the useSelector dependency changes.

// ⸻

// ⚠️ Important Notes:
// 	•	useNavigate, dispatch, etc. are stable (usually) but still functions, and React may treat them as updated depending on your build tool/hot reload behavior or wrapper implementations.
// 	•	Putting them in dependency arrays doesn’t always cause re-renders, but sometimes bundlers create new references. You observed it correctly!



function App(){
    return (<div className="flex flex-col h-screen">
        <Appbar/>
        <Routes>
            <Route path="/" element={<Homepage/>}>
                <Route index  element={<Chatpage/>}/>
                <Route path="message" element={<MessagePage/> } />
            </Route>
            <Route path="/register" element={<Suspense fallback={<Loading/>}> <Register/> </Suspense>} />
            <Route path="/login"  element={<Suspense fallback={<Loading/>}> <Login/> </Suspense>} />
        </Routes>
    </div>)
}


export default App;