
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, SendIcon, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { emailService } from "@/services/emailService";
import { formatDistanceToNow } from "date-fns";

const Sent = () => {
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSentEmails();
  }, []);

  const fetchSentEmails = async () => {
    setIsLoading(true);
    try {
      const emails = await emailService.fetchEmails('sent');
      setSentEmails(emails);
    } catch (error) {
      console.error("Error fetching sent emails:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sent emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSentEmails().finally(() => {
      setIsRefreshing(false);
      toast({
        title: "Sent items refreshed",
        description: "Your sent items have been refreshed",
      });
    });
  };

  // Format and filter the emails
  const formattedEmails = sentEmails.map(email => {
    // For sent emails, the recipient would typically be in recipient_ids
    // This is simplified here - in a complete implementation you would fetch recipient details
    return {
      id: email.id,
      to: (email.recipient || {}).email || 'Unknown recipient', 
      from: "me",  // Since these are sent emails
      subject: email.subject || '(No subject)',
      content: email.body || '',
      time: email.created_at ? formatDistanceToNow(new Date(email.created_at), { addSuffix: true }) : 'Unknown',
      unread: false  // Sent emails are never unread for the sender
    };
  });
  
  const filteredEmails = formattedEmails.filter(email => 
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white dark:bg-background shadow-sm p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-primary dark:text-secondary">Sent Items</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            className={isRefreshing ? "animate-spin" : ""}
            disabled={isRefreshing}
          >
            <RefreshCw className="size-5" />
          </Button>
        </div>
        
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary size-4" />
          <Input 
            placeholder="Search sent emails" 
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
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <SendIcon className="size-16 text-secondary/50 mb-4" />
            <h3 className="text-xl font-medium">No sent emails</h3>
            <p>When you send emails, they'll appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-primary/20 dark:divide-primary/10">
            {filteredEmails.map((email) => (
              <div 
                key={email.id} 
                className="mail-item flex items-center gap-3 p-4 hover:bg-lavender-50 dark:hover:bg-lavender-900/10 cursor-pointer"
                onClick={() => console.log("View sent email", email.id)}
              >
                <Avatar className="size-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-secondary/20 text-secondary dark:bg-secondary/30 dark:text-primary-foreground">
                    Me
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium truncate">To: {email.to}</div>
                    <div className="text-xs text-muted-foreground">{email.time}</div>
                  </div>
                  
                  <div className="truncate pr-4 font-medium">{email.subject}</div>
                  
                  <div className="text-sm text-muted-foreground truncate">
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

export default Sent;
