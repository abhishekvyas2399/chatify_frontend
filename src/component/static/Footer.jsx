function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
  
          <div className="text-lg font-semibold">Chatify</div>
  
          <nav className="flex space-x-6 text-sm mt-2 md:mt-0">
            <a href="#" className="hover:text-blue-400">About</a>
            <a href="#" className="hover:text-blue-400">Privacy</a>
            <a href="#" className="hover:text-blue-400">Terms</a>
          </nav>
  
          <div className="text-xs text-gray-400 mt-2 md:mt-0">
            © {new Date().getFullYear()} Chatify. All rights reserved.
          </div>
  
        </div>
      </footer>
    );
}

export default Footer;