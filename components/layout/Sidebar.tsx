"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  MessageSquare,
  Newspaper,
  CheckSquare,
  Settings
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "대시보드",
    href: "/",
    icon: <Home className="w-5 h-5 mr-3" />,
  },
  {
    title: "캘린더 상세",
    href: "/calendar",
    icon: <Calendar className="w-5 h-5 mr-3" />,
  },
  {
    title: "AI 챗봇",
    href: "/chat",
    icon: <MessageSquare className="w-5 h-5 mr-3" />,
  },
  {
    title: "뉴스 상세",
    href: "/news",
    icon: <Newspaper className="w-5 h-5 mr-3" />,
  },
  {
    title: "할 일 목록",
    href: "/todos",
    icon: <CheckSquare className="w-5 h-5 mr-3" />,
  },
];

const sidebarBottomItems = [
  {
    title: "설정",
    href: "/settings",
    icon: <Settings className="w-5 h-5 mr-3" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-muted/40 md:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl tracking-tight">P.I.D</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <div className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Main Menu
          </div>
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href ? "bg-muted text-primary font-semibold" : ""
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-4">
        <Separator className="mb-4" />
        <nav className="grid items-start text-sm font-medium">
          {sidebarBottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href ? "bg-muted text-primary" : ""
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
