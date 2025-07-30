export default function MediaFile({fileType,fileSignedUrl}){
    const type=fileType?.split('/')[0];
    const extension=fileType?.split('/')[1];
    return (
        <div className="bg-gray-200 max-w-[70%] p-1 m-1 rounded-md inline-block shadow-sm ">
            {type=='image'?<div>
                {/* <a href={fileSignedUrl} download><button>Download</button></a> */}
                <img src={fileSignedUrl} alt="img" />                                            
            </div>:""}
            {type=='video'?
                <video controls width="600"><source src={fileSignedUrl} type={fileType} /></video>
            :""}


            {/* For PDF, docs, zip, etc.  download */}
            {type !== 'image' && type !== 'video' && (
                <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-800 font-medium truncate max-w-[60%]">
                    {extension.toUpperCase()}
                </span>
                <a href={fileSignedUrl} download target="_blank" rel="noopener noreferrer">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded">
                    OPEN / Download
                    </button>
                </a>
                </div>
            )}
        </div>
    )
}