import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Bell, Check, Mail } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "messages"),
      where("authorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      setUnreadCount(msgs.filter((m: any) => !m.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        read: true,
      });
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unreadMsgs = messages.filter((m) => !m.read);
    for (const msg of unreadMsgs) {
      await markAsRead(msg.id);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="relative inline-flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white font-mono">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0 bg-[#0A0A0A] border z-[9999] border-white/10 rounded-xl shadow-2xl text-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-widest flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-400" /> Notifications
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 px-2 text-xs text-slate-400 hover:text-indigo-400"
            >
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No new messages
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 border-b border-white/5 transition-colors ${
                    msg.read ? "bg-transparent opacity-60" : "bg-indigo-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-200 truncate">
                          {msg.name}
                        </p>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {msg.createdAt?.toDate?.().toLocaleDateString() || "Just now"}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 truncate">{msg.email}</p>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-3">
                        {msg.message}
                      </p>
                    </div>
                    {!msg.read && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0 rounded-full hover:bg-white/10"
                        title="Mark as read"
                        onClick={() => markAsRead(msg.id)}
                      >
                        <Check className="h-4 w-4 text-emerald-400" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
