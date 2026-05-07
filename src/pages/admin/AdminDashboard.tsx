import { useEffect, useState } from "react";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { motion } from "motion/react";
import { FolderKanban, Briefcase, Code2, FileText, UploadCloud, File, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, experiences: 0, skills: 0, blogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        const qProjects = query(collection(db, "projects"), where("authorId", "==", user.uid));
        const qExperiences = query(collection(db, "experiences"), where("authorId", "==", user.uid));
        const qSkills = query(collection(db, "skills"), where("authorId", "==", user.uid));
        const qBlogs = query(collection(db, "blogs"), where("authorId", "==", user.uid));

        const [pSnap, eSnap, sSnap, bSnap] = await Promise.all([
          getCountFromServer(qProjects),
          getCountFromServer(qExperiences),
          getCountFromServer(qSkills),
          getCountFromServer(qBlogs),
        ]);

        setStats({
          projects: pSnap.data().count,
          experiences: eSnap.data().count,
          skills: sSnap.data().count,
          blogs: bSnap.data().count,
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user]);

  const statCards = [
    { title: "Active Projects", value: stats.projects, metric: "Pending Deployment", color: "text-slate-400" },
    { title: "Experiences", value: stats.experiences, metric: "Career Nodes", color: "text-emerald-400" },
    { title: "Skills Chart", value: stats.skills, metric: "Indexed", color: "text-indigo-400" },
    { title: "Content DB", value: stats.blogs, metric: "Articles Published", color: "text-purple-400" },
  ];

  if (loading) {
    return <div className="text-slate-500 font-mono text-sm uppercase tracking-widest">Booting Neural OS...</div>;
  }

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">ENGINEER DASHBOARD</h1>
          <p className="text-slate-400 mt-2">Neural OS: Predictive Project Management & Portfolio Analytics</p>
        </div>
        <Link to="/admin/projects" className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-none shadow-[4px_4px_0_rgba(79,70,229,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          Create New Node +
        </Link>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, i) => {
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl"
            >
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{stat.title}</p>
              <p className="text-3xl font-mono mt-1 text-white">{stat.value}</p>
              <p className={`text-xs mt-2 ${stat.color}`}>{stat.metric}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        <div className="flex-[2] bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 z-10">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
              System Infrastructure
            </h2>
            <span className="text-[10px] font-mono text-slate-500">LAST SYNC: SUCCESS</span>
          </div>
          
          <div className="space-y-4 overflow-y-auto pr-2 z-10">
            <Link to="/admin/projects" className="group bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center border border-indigo-500/20">
                  <FolderKanban className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors">Project Matrix</h4>
                  <p className="text-xs text-slate-500">{stats.projects} Nodes • Manage Portfolio</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-2 rounded bg-indigo-600/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">Access</span>
              </div>
            </Link>

            <Link to="/admin/experiences" className="group bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-emerald-500/50 transition-all opacity-80 hover:opacity-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center border border-emerald-500/20">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-emerald-300 transition-colors">Career Timeline</h4>
                  <p className="text-xs text-slate-500">{stats.experiences} Entries • Professional History</p>
                </div>
              </div>
            </Link>
            
            <Link to="/admin/blogs" className="group bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-purple-500/50 transition-all opacity-80 hover:opacity-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-500/20">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">Content Database</h4>
                  <p className="text-xs text-slate-500">{stats.blogs} Articles • Markdown Supported</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <Link to="/admin/projects" className="bg-white/5 border border-white/10 rounded-3xl p-6 flex-1 border-dashed flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors group cursor-pointer">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-sm font-bold text-white uppercase tracking-widest">Upload System</p>
            <p className="text-xs text-slate-500 mt-1">Manage project assets & images</p>
            <button className="mt-4 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-600/30">Access Library</button>
          </Link>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-48">
             <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4">Storage Activity</p>
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                   <p className="text-xs text-white">System ready <span className="text-slate-500">all OK</span></p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
