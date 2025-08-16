'use client'
import React, {useState} from "react"

// export const metadata = {
//   title : "CS3CWA Web App",
//   description : "Assignment 1"
// };


const Nav = () => {
  const [isOpen , setIsOpen ] = useState(false);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <nav>
      <div className = "relative">
      <a href = "/">Home</a>
      <a href = "/about/page.tsx">About Page</a>
      <button onClick={handleClick} className="flex flex-col justify-center items-center space-y-1 p-2">
        <span className = {'bg-steel-500 h-6 w-0.5 rounded-sm transition-all duration-300 ease-out'}></span>
        <span className = {'bg-steel-500 h-6 w-0.5 rounded-sm transition-all duration-300 ease-out'}></span>
        <span className = {'bg-steel-500 h-6 w-0.5 rounded-sm transition-all duration-300 ease-out'}></span>
     </button>
     </div>
          
      {isOpen && 
      <div id = 'hamburgerMenu' className= "absolute left-12 top-0 bg-white shadow-lg p-4 rounded-md" > 
        <ul className="space-y-2">
          <li><a className = " block hover:text-blue-600">Menu</a></li>
          <li><a className = "block hover:text-blue-600">Menu</a></li>
          <li><a className="block hover:text-blue-600">Menu</a></li>
        </ul>

      </div>}
    </nav>
  )
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id = "studentId"> 
          22099453 
        </div>
        {/* Header (shared on all pages) */}
        <header style={{ background: "#333", color: "white", padding: "1rem" }}>
          <Nav></Nav>
        </header>

        {/* Page-specific content */}
        <main style={{ minHeight: "70vh", padding: "1rem" }}>
          {children}
        </main>

        {/* Footer (shared on all pages) */}
        <footer style={{ background: "#eee", textAlign: "center", padding: "1rem" }}>
          <p>© 2025 Huu Tien Dat Huynh | 22099453</p>
        </footer>
      </body>
    </html>
  );
}
