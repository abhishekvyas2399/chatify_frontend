import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
const Register=lazy(()=>import("./component/Register"));
const Login=lazy(()=>import("./component/Login"));
const Chatpage=lazy(()=>import("./component/ChatPage"));
const MessagePage=lazy(()=>import("./component/MessagePage"));
const HomePage=lazy(()=>import("./component/HomePage"));


import Loading from "./component/static/Loading";
import Appbar from "./component/static/Appbar";
import Footer from "./component/static/Footer";

function App(){
    return (<>
        <BrowserRouter>
            <Appbar/>
            <Routes>
                <Route path="/" element={<HomePage/>} >
                    <Route path="/" element={<Chatpage/>} />
                    <Route path="/message" element={<MessagePage/>} />
                </Route>
                <Route path="/message" element={<Suspense fallback={<Loading/>}> <MessagePage/> </Suspense>} />
                <Route path="/register" element={<Suspense fallback={<Loading/>}> <Register/> </Suspense>} />
                <Route path="/login"  element={<Suspense fallback={<Loading/>}> <Login/> </Suspense>} />
            </Routes>
        </BrowserRouter>
        <Footer></Footer>
    </>)
}


export default App;