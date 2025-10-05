import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomBarItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface BottomBarProps {
  items: BottomBarItem[];
}

export function BottomBar({ items }: BottomBarProps) {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border shadow-lg">
      <nav className="flex justify-around items-center h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive && "fill-primary/20"
              )} />
              <span className="text-[10px] font-medium truncate max-w-full px-1">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
