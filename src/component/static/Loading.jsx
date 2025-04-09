function Loading(){
    return <>
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-blue-300 border-t-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
        </div>
        </div>
    </>
}

export default Loading;