
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon, RefreshCw, Inbox as InboxIcon, Star, StarOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { emailService } from "@/services/emailService";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const Inbox = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Format and filter emails 
  const formattedEmails = emails.map(email => ({
    id: email.id,
    from: email.sender?.name || email.sender?.email || 'Unknown',
    fromEmail: email.sender?.email || '',
    avatar: null, // Could implement user avatars in the future
    subject: email.subject || '(No subject)',
    content: email.body || '',
    time: email.created_at ? formatDistanceToNow(new Date(email.created_at), { addSuffix: true }) : 'Unknown',
    unread: !email.is_read,
    important: email.is_starred
  }));
  
  const filteredEmails = formattedEmails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    fetchEmails();
  }, []);
  
  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const inboxEmails = await emailService.fetchEmails('inbox');
      setEmails(inboxEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast({
        title: "Error",
        description: "Failed to fetch emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchEmails().finally(() => {
      setIsRefreshing(false);
      toast({
        title: "Inbox refreshed",
        description: "Your inbox has been refreshed",
      });
    });
  };
  
  const toggleEmailSelection = (id: string) => {
    setSelectedEmails(prev => 
      prev.includes(id) 
        ? prev.filter(emailId => emailId !== id) 
        : [...prev, id]
    );
  };
  
  const toggleImportant = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Find the email and toggle its important status
    const email = emails.find(email => email.id === id);
    if (!email) return;
    
    const newImportantStatus = !email.is_starred;
    
    try {
      const success = await emailService.toggleStar(id, newImportantStatus);
      
      if (success) {
        // Update the local state
        setEmails(emails.map(email => 
          email.id === id ? { ...email, is_starred: newImportantStatus } : email
        ));
      }
    } catch (error) {
      console.error("Error toggling importance:", error);
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  };
  
  const handleSelectAll = () => {
    if (selectedEmails.length === filteredEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmails.map(email => email.id));
    }
  };
  
  const markAsRead = async () => {
    if (selectedEmails.length === 0) return;
    
    try {
      // Update all selected emails to read status
      for (const emailId of selectedEmails) {
        await emailService.markAsRead(emailId, true);
      }
      
      // Update local state
      setEmails(emails.map(email => 
        selectedEmails.includes(email.id) ? { ...email, is_read: true } : email
      ));
      
      toast({
        title: "Marked as read",
        description: `${selectedEmails.length} emails marked as read`,
      });
      
      setSelectedEmails([]);
    } catch (error) {
      console.error("Error marking emails as read:", error);
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  };
  
  const moveToTrash = async () => {
    if (selectedEmails.length === 0) return;
    
    // In a full implementation, this would update a status field in the database
    // For now, we're just removing them from the local state
    setEmails(emails.filter(email => !selectedEmails.includes(email.id)));
    
    toast({
      title: "Moved to trash",
      description: `${selectedEmails.length} emails moved to trash`,
    });
    
    setSelectedEmails([]);
  };

  const openEmail = async (emailId: string) => {
    // Mark as read when opened
    try {
      await emailService.markAsRead(emailId, true);
      
      // Update local state
      setEmails(emails.map(email => 
        email.id === emailId ? { ...email, is_read: true } : email
      ));
      
      // In a full implementation, this would open a detail view of the email
      console.log("Open email", emailId);
    } catch (error) {
      console.error("Error marking email as read:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white dark:bg-mailgray-900 shadow-sm p-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={selectedEmails.length > 0 && selectedEmails.length === filteredEmails.length} 
            onClick={handleSelectAll}
          />
          
          {selectedEmails.length > 0 ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAsRead}
                className="text-mailgray-600 hover:text-lavender-600"
              >
                Mark as read
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={moveToTrash} 
                className="text-mailgray-600 hover:text-red-600"
              >
                Delete
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh} 
              className={isRefreshing ? "animate-spin" : ""}
              disabled={isRefreshing}
            >
              <RefreshCw className="size-5" />
            </Button>
          )}
        </div>
        
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mailgray-400 size-4" />
          <Input 
            placeholder="Search emails" 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Email list */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="size-8 animate-spin text-lavender-500" />
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-mailgray-500">
            <InboxIcon className="size-16 text-lavender-300 mb-4" />
            <h3 className="text-xl font-medium">Your inbox is empty</h3>
            <p>No messages match your search criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-lavender-100 dark:divide-mailgray-800">
            {filteredEmails.map((email) => (
              <div 
                key={email.id} 
                className={`mail-item ${email.unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''} flex items-center gap-3 p-4 hover:bg-lavender-50 dark:hover:bg-lavender-900/10 cursor-pointer`}
                onClick={() => openEmail(email.id)}
              >
                <div className="flex items-center gap-3 pr-3">
                  <Checkbox 
                    checked={selectedEmails.includes(email.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEmailSelection(email.id);
                    }}
                  />
                  <button 
                    onClick={(e) => toggleImportant(email.id, e)}
                    className="text-mailgray-400 hover:text-lavender-500"
                  >
                    {email.important ? (
                      <Star className="size-5 fill-lavender-500 text-lavender-500" />
                    ) : (
                      <StarOff className="size-5" />
                    )}
                  </button>
                </div>
                
                <Avatar className="size-10">
                  <AvatarImage src={email.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-lavender-200 text-lavender-700">
                    {email.from.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`font-medium truncate ${email.unread ? 'font-semibold' : ''}`}>
                      {email.from}
                    </div>
                    <div className="text-xs text-mailgray-500">{email.time}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`truncate pr-4 ${email.unread ? 'font-semibold' : ''}`}>
                      {email.subject}
                    </div>
                    {email.unread && (
                      <Badge variant="outline" className="bg-lavender-100 text-lavender-700 dark:bg-lavender-900 dark:text-lavender-300 rounded-full">
                        New
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-mailgray-500 truncate">
                    {email.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
