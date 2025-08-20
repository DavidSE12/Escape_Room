// components/layout/Header.tsx
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="w-full bg-gray-200 p-4 flex-col justify-between items-center">
      
      <div className="w-full text-lg text-right ">
        <p className="italic text-black mr-12">22099453</p>
      </div>

      <Navbar />
    </header>
  );
}
