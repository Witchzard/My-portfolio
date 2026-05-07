import { Outlet, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-black text-slate-50 selection:bg-teal-500/30 font-sans">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold tracking-tighter text-white">
            JD<span className="text-teal-500">.</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-white transition-colors hidden sm:block">About</a>
            <a href="#experience" className="hover:text-white transition-colors hidden sm:block">Experience</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <Link to="/admin" className="ml-4 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-black py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} John Doe. All rights reserved.</p>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
