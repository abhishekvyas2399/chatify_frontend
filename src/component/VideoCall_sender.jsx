import { useCallback, useEffect, useRef, useState } from "react"

import callEndSvg from "../assets/call_end.svg"
import { useSocket } from "../context/SocketContext";
import { clearVideoCallChatData } from "../redux/slices/videoCallSlice";


export default function VideoCall_sender({roomId,EndVideoCall,setAccepted,setCallStarted}){
    const socket=useSocket();
    const remoteVideoRef=useRef();
    const localVideoRef=useRef();
    const [peerConnectionRef,setPeerConnectionRef]=useState(null);
    const [localStream,setLocalStream]=useState(null);

    console.log("sender side : ",roomId);

    useEffect(() => {
        const startMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: { width: 640, height: 480 }, audio: true});
                localVideoRef.current.srcObject = stream;
                setLocalStream(stream);
            } catch (err) {
                console.error('Error accessing media devices.', err);
            }
        };
        startMedia();
    }, []);

    const initiateCall = useCallback(async () => {
        if (!peerConnectionRef) return;

        const offer = await peerConnectionRef.createOffer();
        await peerConnectionRef.setLocalDescription(offer);
        socket.emit('offer',{roomId,offer});
    },[socket,peerConnectionRef]);

    useEffect(()=>{
        if(!localStream)    return;

        if(!peerConnectionRef){
            const rtcPeer=new RTCPeerConnection({
                iceServers:[
                    { urls: 'stun:stun.l.google.com:19302' },
                ],
            })
            setPeerConnectionRef(rtcPeer);
            return;
        }

        localStream.getTracks().forEach((track) => {
        peerConnectionRef.addTrack(track, localStream);
        });

        peerConnectionRef.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnectionRef.onicecandidate = (event) => {
            if(event.candidate){
            socket.emit('ice-candidate', {roomId,iceCandidate:event.candidate});
            }
        };

        // socket.on('offer', async ({roomId,offer}) => {
        //     await peerConnectionRef.setRemoteDescription(new RTCSessionDescription(offer));
        //     const answer = await peerConnectionRef.createAnswer();
        //     await peerConnectionRef.setLocalDescription(answer);
        //     socket.emit('answer', {roomId,answer});
        // });

        socket.on('answer', async (answer) => {
            await peerConnectionRef.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('ice-candidate', async (iceCandidate) => {
            try {
                await peerConnectionRef.addIceCandidate(iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        });

        initiateCall();

        return () => {
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
        };
    },[socket,localStream,peerConnectionRef]);

    return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
      {/* Remote Video */}
      <video ref={remoteVideoRef} autoPlay playsInline className="w-[90%] h-[60%] bg-black object-cover rounded-lg shadow-xl"/>
      {/* Local Video small corner */}
      <video ref={localVideoRef} autoPlay playsInline muted className="w-40 h-32 absolute bottom-24 right-4 bg-gray-800 object-cover rounded-md border"/>

      {/* User Info */}
      {/* <div className="text-white mt-4 text-xl">{callUser || "Calling..."}</div> */}

      {/* Call Controls */}
      <div className="mt-6 flex gap-4">
        {/* <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600">
          <Mic className="w-6 h-6" />
        </button> */}
        {/* <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600">
          <Video className="w-6 h-6" />
        </button> */}
        <button
          onClick={()=>{EndVideoCall();dispatch(clearVideoCallChatData());}}
          className="bg-red-600 text-white p-3 rounded-full hover:bg-red-500"
        >
          <img src={callEndSvg} alt="cut call" className="w-6 h-6" />
        </button>
      </div>
    </div>
    )
}