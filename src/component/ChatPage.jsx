import Chats from "./Chats";
import Messages from "./Messages";


function Chatpage(){
    return (
        <div className="flex h-[85vh] ">
          <div className="w-full p-4  md:w-1/3">
              <Chats></Chats>
          </div>
          <div className="flex-1 p-4 md:block hidden">
              <Messages></Messages>
          </div>
        </div>
      );
}

export default Chatpage;