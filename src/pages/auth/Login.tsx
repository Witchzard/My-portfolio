import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "motion/react";

export default function Login() {
  const { user, signIn } = useAuth();

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020202] flex-col p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 mb-8 text-center">
         <div className="w-12 h-12 bg-indigo-600 mx-auto rounded-xl flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] mb-4 text-xl">N</div>
         <h2 className="text-3xl font-black tracking-tighter text-white uppercase">NEURAL<span className="text-indigo-400">CORE</span></h2>
         <p className="text-xs uppercase font-bold text-slate-500 tracking-widest mt-2">v4.0.2 SECURE ACCESS</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10"
      >
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Authenticate to access management systems.</p>
          </div>
          
          <button 
            className="w-full bg-white text-black font-bold text-sm uppercase tracking-widest py-3 flex items-center justify-center gap-3 rounded-md hover:bg-slate-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            onClick={signIn}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google Access
          </button>
        </div>
      </motion.div>
    </div>
  );
}
