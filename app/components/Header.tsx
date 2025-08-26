// components/layout/Header.tsx
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="w-full p-4 flex-col justify-between items-center">
      
      <div className="w-full text-lg text-right ">
        <p className="italic mr-12">22099453</p>
      </div>

      <Navbar />
    </header>
  );
}
