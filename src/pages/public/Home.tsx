import { useEffect, useState } from "react";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";
import { Github, Linkedin, ExternalLink, ArrowRight, Code2, Mail, ChevronDown } from "lucide-react";
import Hero3D from "../../components/Hero3D";
import { ContactDialog } from "../../components/ContactDialog";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch first profile
        const profQ = query(collection(db, "userProfiles"), limit(1));
        const profSnap = await getDocs(profQ);
        if (!profSnap.empty) {
          setProfile({ id: profSnap.docs[0].id, ...profSnap.docs[0].data() });
        }

        // Fetch recent projects
        const projQ = query(collection(db, "projects"), limit(6));
        const projSnap = await getDocs(projQ);
        const pData = projSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort in memory safely
        pData.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setProjects(pData);

      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Fallback content if empty
  const displayName = profile?.name || "Software Engineer & AI Developer";
  const displayTitle = profile?.title || "Building intelligent systems and modern web experiences.";
  const displayBio = profile?.bio || "I specialize in creating high-performance applications bridging the gap between cutting-edge AI and intuitive user interfaces.";

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen -mt-20 overflow-hidden">
        <Hero3D />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2.5, ease: "easeOut" }}
          className="relative z-30 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 2.8 }}
            className="inline-flex items-center rounded-full border border-indigo-500/50 bg-black/40 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-emerald-400 mb-8 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse [box-shadow:0_0_10px_rgba(16,185,129,0.8)]"></span>
            SYSTEM ONLINE // READY
          </motion.div>
          
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-white mb-6 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <span className="opacity-90">I'M </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] tracking-widest">{displayName.split(" ")[0] || "John"}</span><span className="text-emerald-500">_</span>
            <br />
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3.5 }}
              className="text-3xl sm:text-5xl lg:text-5xl text-slate-200 mt-2 block tracking-[0.2em] font-medium uppercase"
            >
              {displayTitle}
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.8 }}
            className="text-xl sm:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-mono text-sm"
          >
            &gt; {displayBio}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 4.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8"
          >
            <a href="#projects" className="group relative inline-flex items-center justify-center rounded-sm bg-emerald-500 px-8 py-4 text-sm font-bold text-black uppercase tracking-widest transition-all hover:scale-105 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)]">
              INITIALIZE SEQUENCE <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-black" />
            </a>
            <div className="flex gap-4">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="p-4 rounded-sm border border-emerald-500/30 bg-black/50 text-emerald-400 backdrop-blur-md hover:bg-emerald-500 hover:text-black transition-all hover:scale-110 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="p-4 rounded-sm border border-indigo-500/30 bg-black/50 text-indigo-400 backdrop-blur-md hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all hover:scale-110 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Global Dark Fade Entrance Overlay */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 z-50 bg-[#010103] pointer-events-none"
        />
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-slate-400"
        >
          <span className="text-xs uppercase tracking-[0.2em] mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 opacity-70" />
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32 py-20 relative z-10">
        {/* Projects Section */}
      <section id="projects" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Featured Projects</h2>
            <p className="text-slate-400">Some of the recent things I've built and shipped.</p>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/50 transition-colors"
            >
              <div className="aspect-video w-full overflow-hidden bg-black/50">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Code2 className="h-12 w-12 text-slate-800" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">{project.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-3 mb-6">
                  {project.description}
                </p>
                <div className="flex gap-4 text-slate-400">
                  {project.githubUrl && (
                    <a href={project.githubUrl} className="hover:text-white transition-colors" target="_blank" rel="noreferrer">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} className="hover:text-white transition-colors" target="_blank" rel="noreferrer">
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center border border-white/10 rounded-2xl bg-white/5">
              <p className="text-slate-400">No projects to display yet. Log in to the admin panel to add some!</p>
            </div>
          )}
        </div>
      </section>

      {/* About / Contact Teaser */}
      <section id="contact" className="py-20 border-t border-white/10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Let's build something together</h2>
          <p className="text-lg text-slate-400 mb-8">
            Feel free to reach out if you're looking for a developer, have a question, or simply want to connect.
          </p>
          <ContactDialog ownerId={profile?.id} />
        </motion.div>
      </section>
      </div>
    </div>
  );
}
