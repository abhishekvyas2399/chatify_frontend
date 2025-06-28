import { useCallback, useEffect, useRef, useState } from "react"

import callEndSvg from "../assets/call_end.svg"
import { useSocket } from "../context/SocketContext";


export default function VideoCall_sender({roomId,EndVideoCall,currentStream}){
    const socket=useSocket();
    const remoteVideoRef=useRef();
    const localVideoRef=useRef();
    const [peerConnectionRef,setPeerConnectionRef]=useState(null);
    const [localStream,setLocalStream]=useState(null);

    const iceCandidateList=useRef([]);
    const isRemoteDescriptionSet=useRef(false);

    console.log("sender side : ",roomId);

    useEffect(() => {
        const startMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: { width: 640, height: 480 }, audio: true});
                localVideoRef.current.srcObject = stream;
                setLocalStream(stream);
                currentStream.current=stream;
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

        socket.on('answer', async (answer) => {
            await peerConnectionRef.setRemoteDescription(new RTCSessionDescription(answer));
            isRemoteDescriptionSet.current=true;

            iceCandidateList.current.forEach(async (candidate)=>{
                try {
                    await peerConnectionRef.addIceCandidate(candidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            })
            iceCandidateList.current=[];
        });

        socket.on('ice-candidate', async (iceCandidate) => {
            if(isRemoteDescriptionSet.current){
                try {
                    await peerConnectionRef.addIceCandidate(iceCandidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }else{
                iceCandidateList.current.push(iceCandidate);
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
            {/* Remote Video */}
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain"/>
            </div>
            {/* Local Video */}
            <div className="absolute bottom-6 right-6 w-32 h-24 md:w-40 md:h-32 rounded-md overflow-hidden border border-white bg-gray-800 shadow-lg">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-contain"/>
            </div>
            {/* Call Controls */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
                {/* <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600">
                    <Mic className="w-6 h-6" />
                </button> */}
                {/* <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600">
                    <Video className="w-6 h-6" />
                </button> */}
                <button onClick={() => EndVideoCall()} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-500">
                    <img src={callEndSvg} alt="cut call" className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}