import Chats from "../component/Chats";
import Messages from "../component/Messages";


function Chatpage(){
    return (
        <div className="flex h-[85vh] overflow-hidden">
          <div className="w-full px-4 pt-4  md:w-1/3 overflow-hidden">
              <Chats></Chats>
          </div>
          <div className="flex-1 px-4 pt-4 md:block hidden overflow-hidden">
              <Messages></Messages>
          </div>
        </div>
      );
}

export default Chatpage;