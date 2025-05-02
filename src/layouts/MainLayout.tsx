
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash, 
  Star, 
  Archive, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  User, 
  Users 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AiviaLogo from "@/components/AiviaLogo";
import ProfileAvatar from "@/components/ProfileAvatar";

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
    <div className="flex h-screen bg-aivia-very-light-purple dark:bg-aivia-deep-purple">
      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-20 h-full bg-white dark:bg-aivia-deep-purple shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AiviaLogo className="size-10" />
              {sidebarOpen && <span className="font-bold text-lg text-aivia-deep-purple dark:text-aivia-light-purple">AIVIA-MBox</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <X className="size-5" />
            </Button>
          </div>
          
          {/* Compose button */}
          <div className="px-3 py-2">
            <Button className={`
              ${sidebarOpen ? 'w-full' : 'w-14 h-14 rounded-full mx-auto'} 
              bg-aivia-medium-purple hover:bg-aivia-deep-purple text-white dark:text-white flex items-center justify-center
            `}>
              {sidebarOpen ? 'Compose' : '+'}
            </Button>
          </div>
          
          <Separator className="my-2 bg-aivia-medium-purple/20 dark:bg-aivia-light-purple/10" />
          
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
                <div className="pt-4 mt-4 border-t border-aivia-medium-purple/20 dark:border-aivia-light-purple/10">
                  <div className="text-xs uppercase text-muted-foreground dark:text-muted-foreground font-semibold px-4 mb-2">
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
        <header className="h-16 bg-white dark:bg-aivia-deep-purple shadow-sm flex items-center justify-between px-4 z-10">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
              <Menu className="size-5" />
            </Button>
            <h1 className="text-xl font-semibold text-aivia-deep-purple dark:text-aivia-light-purple">
              {location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(1).slice(1)}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </Button>
            
            <ProfileAvatar onLogout={handleLogout} />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-0 bg-aivia-very-light-purple dark:bg-aivia-deep-purple">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
