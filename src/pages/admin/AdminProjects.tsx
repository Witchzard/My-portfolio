import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Plus, Trash2, Video, Image as ImageIcon, Link as LinkIcon, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  videoUrl: string;
  featured: boolean;
  categories: string[];
  coverImage?: string;
  createdAt: any;
}

export default function AdminProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "projects"), where("authorId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Project[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Project);
      });
      // Sort in memory for simplicity
      data.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setProjects(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      toast.error("Failed to load projects");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const openNewDialog = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTechStack("");
    setGithubUrl("");
    setLiveUrl("");
    setVideoUrl("");
    setCoverImage("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (p: Project) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setTechStack(p.techStack?.join(", ") || "");
    setGithubUrl(p.githubUrl || "");
    setLiveUrl(p.liveUrl || "");
    setVideoUrl(p.videoUrl || "");
    setCoverImage(p.coverImage || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      toast.success("Project deleted");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const storageRef = ref(storage, `projects/${user.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        toast.error("Upload failed");
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setCoverImage(downloadURL);
          setUploading(false);
          toast.success("Image uploaded!");
        });
      }
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const projectData = {
        title,
        description,
        techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
        githubUrl,
        liveUrl,
        videoUrl,
        coverImage,
        authorId: user.uid,
        featured: false,
        categories: [],
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), {
          ...projectData,
          updatedAt: serverTimestamp(),
        });
        toast.success("Project updated!");
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success("Project created!");
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save project");
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">PROJECT MANAGEMENT</h1>
          <p className="text-slate-400 mt-2">Manage your portfolio projects & repositories.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            onClick={openNewDialog}
            className="px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-none shadow-[4px_4px_0_rgba(79,70,229,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Create New Node +
          </DialogTrigger>
          <DialogContent className="bg-[#050505] border-white/10 text-slate-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white font-black tracking-tight">{editingId ? "Edit Project Node" : "New Project Node"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</Label>
                <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</Label>
                <Textarea id="desc" required value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px] bg-black/40 border-white/10 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tech Stack (comma separated)</Label>
                <Input id="tech" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Node.js, Tailwind" className="bg-black/40 border-white/10 focus-visible:ring-indigo-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="git" className="text-xs font-bold text-slate-400 uppercase tracking-widest">GitHub URL</Label>
                  <Input id="git" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="live" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live URL</Label>
                  <Input id="live" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="bg-black/40 border-white/10 focus-visible:ring-indigo-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cover Image</Label>
                <div className="flex items-center gap-4">
                  {coverImage && (
                    <img src={coverImage} alt="Cover" className="h-16 w-16 object-cover rounded border border-white/10" />
                  )}
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-black/40 border-white/10 text-slate-400 file:text-white" />
                </div>
                {uploading && <div className="text-xs text-indigo-400 font-mono">Uploading... {Math.round(uploadProgress)}%</div>}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 bg-white/5 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">Cancel</button>
                <button type="submit" disabled={uploading} className="px-6 py-2 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded hover:bg-indigo-500 transition-colors disabled:opacity-50">
                  Save Node
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {loading ? (
        <div className="text-slate-500 font-mono text-sm uppercase tracking-widest">Loading Records...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col">
              {project.coverImage ? (
                <div className="h-48 w-full overflow-hidden border-b border-white/10">
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              ) : (
                <div className="h-48 w-full bg-black/40 flex items-center justify-center border-b border-white/10">
                  <ImageIcon className="h-8 w-8 text-slate-600" />
                </div>
              )}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                  <div className="flex gap-2 text-slate-500">
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github className="h-4 w-4" /></a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><LinkIcon className="h-4 w-4" /></a>}
                  </div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-3 mb-6">{project.description}</p>
                
                <div className="mt-auto flex justify-between items-center w-full">
                   <div className="flex gap-1 flex-wrap">
                      {project.techStack?.slice(0, 2).map((tech: string) => (
                        <span key={tech} className="text-[10px] uppercase font-mono bg-white/5 px-2 py-1 rounded text-slate-400">{tech}</span>
                      ))}
                      {project.techStack?.length > 2 && (
                         <span className="text-[10px] uppercase font-mono bg-white/5 px-2 py-1 rounded text-slate-400">+{project.techStack.length - 2}</span>
                      )}
                   </div>
                   <div className="flex gap-2">
                    <button className="p-2 rounded bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors" onClick={() => openEditDialog(project)}>
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 border border-dashed border-white/10 rounded-3xl">
              No project nodes instantiated.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
