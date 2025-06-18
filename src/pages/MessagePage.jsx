import Chats from "../component/Chats";
import Messages from "../component/Messages";

function MessagePage(){
    return (
        <div className="flex h-[85vh] overflow-hidden">
          <div className="w-1/3  p-4  md:block hidden">
              <Chats></Chats>
          </div>
          <div className="flex-1 p-4 overflow-hidden">
              <Messages></Messages>
          </div>
        </div>
      );
}

export default MessagePage;