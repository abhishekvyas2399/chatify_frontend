import {useEffect, useRef, useState } from "react"

import callEndSvg from "../assets/call_end.svg"
import { useSocket } from "../context/SocketContext";


export default function VideoCall_reciever({roomId,EndVideoCall,currentStream}){
    const socket=useSocket();
    const remoteVideoRef=useRef();
    const localVideoRef=useRef();
    const peerConnectionRef=useRef();
    const [localStream,setLocalStream]=useState(null);

    const iceCandidateList=useRef([]);
    const isRemoteDescriptionSet=useRef(false);

    console.log("reciever side : ",roomId);

    useEffect(() => {
        const startMedia = async () => {
            try{
                const stream = await navigator.mediaDevices.getUserMedia({video: { width: 640, height: 480 }, audio: true});
                localVideoRef.current.srcObject = stream;
                setLocalStream(stream);
                currentStream.current=stream;
            }catch(err){
                console.error('Error accessing media devices.', err);
            }
        };
        startMedia();
    }, []);

    useEffect(()=>{
        if(!localStream)    return;

        peerConnectionRef.current=new RTCPeerConnection({
            iceServers:[
                { urls: 'stun:stun.l.google.com:19302' },
            ],
        })

        localStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStream);
        });

        peerConnectionRef.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnectionRef.current.onicecandidate = (event) => {
            if(event.candidate){
            socket.emit('ice-candidate', {roomId,iceCandidate:event.candidate});
            }
        };

        socket.on('offer', async ({roomId,offer}) => {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            isRemoteDescriptionSet.current=true;
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit('answer', {roomId,answer});

            iceCandidateList.current.forEach(async (candidate)=>{
                try {
                    await peerConnectionRef.current.addIceCandidate(candidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            })
            iceCandidateList.current=[];
        });

        socket.on('ice-candidate', async (iceCandidate) => {
            if(isRemoteDescriptionSet.current){
                try {
                    await peerConnectionRef.current.addIceCandidate(iceCandidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }else{
                iceCandidateList.current.push(iceCandidate);
            }
        });

        return () => {
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
        };
    },[socket,localStream]);


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