import {Outlet} from "react-router-dom"
import Loading from "./static/Loading"
import ServerOff from "./static/ServerOff"

import {Socket} from "../context/socketContext"
import {useLoadReduxData} from "../hooks/useLoadReduxData"
import {useSocket} from "../hooks/useSocket"

// ***** chatGPT *****
// In JavaScript, functions follow closure properties, meaning they capture variables from their surrounding scope.
// 1.	Functions in useEffect rely on closures → If a function inside useEffect captures an outdated value, it might behave incorrectly.
// 2.	To avoid using stale functions, we put them in the dependency array so React re-creates them when needed.
// 	•	We put dispatch in [] because, if it ever changes, we need to update our function.
//  •	We put functions like loadEverything in [] because they depend on dispatch and should always have the latest version.
//  •	Not just state & props go in [], but also functions or any value that might affect execution due to closures.

function Homepage(){
    const {isServerOn,isReduxLoading}=useLoadReduxData();
    const {socket,isSocketLoading}=useSocket(isReduxLoading);

    if(!isServerOn)     return  <ServerOff></ServerOff>
    if(isSocketLoading)  return <Loading></Loading>

    return (
        <div>
            <Socket.Provider value={{socket}}>
                <Outlet/>{/* outlet will render Chats or Messages depending on the URL */}
            </Socket.Provider>
        </div>
      );
}
export default Homepage;