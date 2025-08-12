import { useState } from "react";
import fullScreen from "../assets/full_Screen.svg"

export default function MediaFile({fileType,fileSignedUrl}){
    const type=fileType?.split('/')[0];
    const extension=fileType?.split('/')[1];

    const [loading, setLoading] = useState(true);
    return (
        <div className="bg-gray-200 max-w-[70%] p-1 m-1 rounded-md inline-block shadow-sm">
            {/* Image */}
            {type === "image" && (
                <div className="relative w-50 h-50 rounded overflow-hidden bg-gray-300">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-blue-500 animate-spin rounded-full"></div>
                    </div>
                )}
                <img src={fileSignedUrl} alt="img" onLoad={() => setLoading(false)} className={`w-full h-full object-cover transition-opacity duration-300 ${  loading ? "opacity-0" : "opacity-100" }`}/>
                <a href={fileSignedUrl} download target="_blank" rel="noopener noreferrer">
                    <img src={fullScreen} alt="fullScreen" fill="currentcolor" className="w-[10px] h-[10px] text-amber-50 absolute bottom-[4px] right-[4px]" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="absolute bottom-[2px] right-[2px]">
                      <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </a>
                </div>
            )}
            {/* Video */}
            {type === "video" && (
                <video controls width="450" className="rounded-md">
                <source src={fileSignedUrl} type={fileType} />
                </video>
            )}

            {/* PDF, ZIP, ... */}
            {type !== "image" && type !== "video" && (
                <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-800 font-medium truncate max-w-[60%]">
                    {extension.toUpperCase()}
                </span>
                <a href={fileSignedUrl} download target="_blank" rel="noopener noreferrer">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 text-sm rounded">
                    OPEN / Download
                    </button>
                </a>
                </div>
            )}
        </div>
    )
}