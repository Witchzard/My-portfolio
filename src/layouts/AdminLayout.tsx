import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, FolderKanban, Briefcase, Code2, FileText, Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "../components/NotificationBell";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/blogs", label: "Blog CMS", icon: FileText },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const Sidebar = () => (
    <div className="flex h-full flex-col gap-8 py-6 px-6 bg-[#050505] text-slate-200 border-r border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          {user.displayName?.charAt(0).toUpperCase() || "N"}
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white uppercase">NEURAL<span className="text-indigo-400">CORE</span></h2>
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Management</p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-auto pt-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 mb-6">
           <p className="text-xs font-semibold text-indigo-200 mb-2">Sync Status</p>
           <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
             <div className="w-2/3 h-full bg-indigo-500"></div>
           </div>
           <p className="text-[10px] text-slate-500 mt-2">Active DB Conn</p>
        </div>
        <div className="flex items-center gap-3 py-2 text-sm text-slate-400 mb-2">
          <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-gradient-to-tr from-slate-800 to-indigo-900 flex items-center justify-center">
            {user.photoURL ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" /> : user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 truncate">
            <p className="font-medium text-slate-200 truncate">{user.displayName}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-red-500 transition-colors hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020202] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="hidden md:block md:w-64 shrink-0 overflow-y-auto border-r border-white/5">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl px-4 md:px-8 z-50">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger className="md:hidden text-slate-400 hover:text-slate-200 hover:bg-white/5 p-2 rounded-md">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0 bg-[#050505] border-r border-white/5">
                <Sidebar />
              </SheetContent>
            </Sheet>
                         
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-mono text-emerald-500 uppercase tracking-tighter">AI Engine Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 rounded border border-white/10 text-[10px] uppercase tracking-widest text-slate-500">v4.0.2 Stable</span>
            <NotificationBell />
            <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-gradient-to-tr from-slate-800 to-indigo-900 hidden md:flex items-center justify-center text-white text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#020202] flex flex-col gap-8">
          <Outlet />
        </main>

        <footer className="h-10 bg-black border-t border-white/10 px-4 md:px-8 flex items-center justify-between text-[10px] font-mono text-slate-500 tracking-tighter uppercase shrink-0">
          <div className="flex gap-4 md:gap-8">
            <span>Session: Active</span>
            <span className="hidden sm:inline">Latency: 24ms</span>
          </div>
          <div className="flex gap-4">
            <span className="text-indigo-400 hidden sm:inline">Port: 3000</span>
            <span className="text-slate-300">Admin Mode Enabled</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
