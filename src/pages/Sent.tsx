
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SearchIcon, SendIcon } from "lucide-react";
import { generateMockEmails } from "@/lib/mock-data";

const Sent = () => {
  const sentEmails = generateMockEmails(10).map(email => ({
    ...email,
    to: email.from, // The recipient is the original sender
    from: "me@yourcompany.com", // The sender is now "me"
    unread: false, // Sent emails are never unread
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white dark:bg-mailgray-900 shadow-sm p-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-medium text-aivia-lavender dark:text-aivia-lavender">Sent Items</h2>
        
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-aivia-gray size-4" />
          <Input placeholder="Search sent emails" className="pl-10" />
        </div>
      </div>
      
      {/* Email list */}
      <div className="flex-1 overflow-auto">
        {sentEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-aivia-gray">
            <SendIcon className="size-16 text-aivia-lavender/50 mb-4" />
            <h3 className="text-xl font-medium">No sent emails</h3>
            <p>When you send emails, they'll appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-aivia-lavender/20 dark:divide-aivia-lavender/10">
            {sentEmails.map((email) => (
              <div 
                key={email.id} 
                className="mail-item flex items-center gap-3"
              >
                <Avatar className="size-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-aivia-lavender/20 text-aivia-lavender dark:bg-aivia-lavender/30 dark:text-primary-foreground">
                    Me
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium truncate">To: {email.to}</div>
                    <div className="text-xs text-aivia-gray">{email.time}</div>
                  </div>
                  
                  <div className="truncate pr-4 font-medium">{email.subject}</div>
                  
                  <div className="text-sm text-aivia-gray truncate">
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
