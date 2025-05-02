
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash, 
  Star, 
  Archive, 
  LogOut, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  User, 
  Users 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AiviaLogo from "@/components/AiviaLogo";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const menuItems = [
    { title: "Inbox", icon: <Inbox className="size-5" />, path: "/inbox" },
    { title: "Sent", icon: <Send className="size-5" />, path: "/sent" },
    { title: "Drafts", icon: <FileText className="size-5" />, path: "/drafts" },
    { title: "Important", icon: <Star className="size-5" />, path: "/important" },
    { title: "All Mail", icon: <Archive className="size-5" />, path: "/all" },
    { title: "Trash", icon: <Trash className="size-5" />, path: "/trash" },
  ];

  const adminItems = [
    { title: "Users", icon: <User className="size-5" />, path: "/admin/users" },
    { title: "Groups", icon: <Users className="size-5" />, path: "/admin/groups" },
  ];
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-lavender-50 dark:bg-mailgray-950">
      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-20 h-full bg-white dark:bg-mailgray-900 shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AiviaLogo className="size-10" />
              {sidebarOpen && <span className="font-bold text-lg text-lavender-700 dark:text-lavender-300">AIVIA-MBox</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <X className="size-5" />
            </Button>
          </div>
          
          {/* Compose button */}
          <div className="px-3 py-2">
            <Button className={`
              ${sidebarOpen ? 'w-full' : 'w-14 h-14 rounded-full mx-auto'} 
              bg-lavender-600 hover:bg-lavender-700 text-white flex items-center justify-center
            `}>
              {sidebarOpen ? 'Compose' : '+'}
            </Button>
          </div>
          
          <Separator className="my-2 bg-lavender-100 dark:bg-mailgray-800" />
          
          {/* Navigation */}
          <div className="flex-1 overflow-auto py-2">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className={`sidebar-item ${isActive(item.path) ? 'active' : ''} ${sidebarOpen ? 'justify-start w-full' : 'justify-center'}`}
                >
                  {item.icon}
                  {sidebarOpen && <span>{item.title}</span>}
                </button>
              ))}
              
              {/* Admin section - only visible to admin users */}
              {isAdmin && sidebarOpen && (
                <div className="pt-4 mt-4 border-t border-lavender-100 dark:border-mailgray-800">
                  <div className="text-xs uppercase text-mailgray-500 dark:text-mailgray-400 font-semibold px-4 mb-2">
                    Admin
                  </div>
                  {adminItems.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => navigate(item.path)}
                      className={`sidebar-item ${isActive(item.path) ? 'active' : ''} w-full justify-start`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-mailgray-900 shadow-sm flex items-center justify-between px-4 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
              <Menu className="size-5" />
            </Button>
            <h1 className="text-xl font-semibold text-lavender-700 dark:text-lavender-300">
              {location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(1).slice(1)}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-9 rounded-full">
                  <Avatar className="size-9">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-lavender-200 text-lavender-700">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 cursor-pointer">
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-0 bg-lavender-50 dark:bg-mailgray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
