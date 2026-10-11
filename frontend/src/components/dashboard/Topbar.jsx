import { Menu, Bell, Plus, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onMenuClick, onAddActivity }) {
  const { user } = useAuth();
  const userName = user.name || "Eco User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl md:px-9">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={16} />
        </Button>
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Your overview</p>
          <h2 className="font-display text-lg font-semibold tracking-tight">A clearer view of your impact</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="hidden sm:inline-flex" onClick={onAddActivity}>
          <Plus size={14} />
          <span className="hidden sm:inline">Add Activity</span>
        </Button>
        <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
        </Button>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-xl border border-border px-2 py-1.5 hover:border-primary/40"
        >
          <Avatar className="size-8">
            <AvatarFallback>{initials || <User size={14} />}</AvatarFallback>
          </Avatar>
          <div className="hidden leading-tight sm:block">
            <strong className="block text-xs">{userName}</strong>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">Eco User <ChevronDown size={11} /></span>
          </div>
        </Link>
      </div>
    </header>
  );
}
