import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "sonner";
import { Mail, Loader2, Send } from "lucide-react";

export function ContactDialog({ ownerId }: { ownerId: string }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        authorId: ownerId,
        read: false,
        createdAt: serverTimestamp(),
      });
      toast.success("Message sent successfully!");
      setOpen(false);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-indigo-400"
      >
        Say Hello <Mail className="ml-2 h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border border-white/10 text-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">Send a Message</DialogTitle>
          <DialogDescription className="text-slate-400">
            I'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</label>
            <Input
              required
              placeholder="John Doe"
              className="bg-black/50 border-white/10 focus-visible:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</label>
            <Input
              required
              type="email"
              placeholder="john@example.com"
              className="bg-black/50 border-white/10 focus-visible:ring-indigo-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Message</label>
            <Textarea
              required
              placeholder="Hi, I'd like to work with you..."
              className="bg-black/50 border-white/10 focus-visible:ring-indigo-500 min-h-[120px]"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <DialogFooter className="pt-4 border-t border-white/5 mx-[-1rem] px-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)]"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
