"use client";


import Link from "next/link";
import {useState} from 'react';

export default function Home() {
  const [activePage, setActivePage] = useState(0);
  return (
    <header>
      <Link href="\" onClick={ () => setActivePage(0)} className={ activePage === 0 ? "font-bold" : ""} >Home</Link> 
      <Link href="\about" onClick={ () => setActivePage(1)} className={ activePage === 1 ? "font-bold" : ""} >About</Link>
      <Link href="\page" onClick={ () => setActivePage(2)} className={ activePage === 2 ? "font-bold" : ""} >Page</Link>
    </header>
    
  );
}
