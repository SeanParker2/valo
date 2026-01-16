"use client";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-24 px-12 text-center md:text-left text-white">
      <div className="flex flex-col md:flex-row justify-between items-end">
        <div>
           <h1 className="font-serif text-[12rem] leading-none text-[#141414] select-none">VALO</h1>
        </div>
        <div className="flex gap-8 mb-8 md:mb-4">
           <a href="#" className="text-gray-500 hover:text-white font-sans text-xs font-bold tracking-widest transition-colors">INSTAGRAM</a>
           <a href="#" className="text-gray-500 hover:text-white font-sans text-xs font-bold tracking-widest transition-colors">WEIBO</a>
           <a href="#" className="text-gray-500 hover:text-white font-sans text-xs font-bold tracking-widest transition-colors">CONTACT</a>
        </div>
      </div>
    </footer>
  )
}
