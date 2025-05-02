
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, TrashIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { generateMockEmails } from "@/lib/mock-data";

const Trash = () => {
  const { toast } = useToast();
  const [trashedEmails, setTrashedEmails] = useState(generateMockEmails(8));
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  
  const toggleEmailSelection = (id: string) => {
    setSelectedEmails(prev => 
      prev.includes(id) 
        ? prev.filter(emailId => emailId !== id) 
        : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedEmails.length === trashedEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(trashedEmails.map(email => email.id));
    }
  };
  
  const deleteSelected = () => {
    if (selectedEmails.length === 0) return;
    
    setTrashedEmails(trashedEmails.filter(email => !selectedEmails.includes(email.id)));
    
    toast({
      title: "Emails deleted permanently",
      description: `${selectedEmails.length} emails deleted permanently`,
    });
    
    setSelectedEmails([]);
  };
  
  const deleteAll = () => {
    setTrashedEmails([]);
    
    toast({
      title: "Trash emptied",
      description: "All emails in trash have been deleted permanently",
    });
  };
  
  const restoreSelected = () => {
    if (selectedEmails.length === 0) return;
    
    setTrashedEmails(trashedEmails.filter(email => !selectedEmails.includes(email.id)));
    
    toast({
      title: "Emails restored",
      description: `${selectedEmails.length} emails restored to inbox`,
    });
    
    setSelectedEmails([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white dark:bg-mailgray-900 shadow-sm p-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={selectedEmails.length > 0 && selectedEmails.length === trashedEmails.length} 
            onClick={handleSelectAll}
          />
          
          {selectedEmails.length > 0 ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={restoreSelected}
                className="text-mailgray-600 hover:text-lavender-600"
              >
                Restore
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={deleteSelected} 
                className="text-mailgray-600 hover:text-red-600"
              >
                Delete permanently
              </Button>
            </>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-mailgray-600 hover:text-red-600"
                  disabled={trashedEmails.length === 0}
                >
                  Empty trash
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all items in trash.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAll} className="bg-red-600 hover:bg-red-700">
                    Yes, empty trash
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      {/* Email list */}
      <div className="flex-1 overflow-auto">
        {trashedEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-mailgray-500">
            <TrashIcon className="size-16 text-lavender-300 mb-4" />
            <h3 className="text-xl font-medium">Trash is empty</h3>
            <p>No deleted messages</p>
          </div>
        ) : (
          <div className="divide-y divide-lavender-100 dark:divide-mailgray-800">
            {trashedEmails.map((email) => (
              <div 
                key={email.id} 
                className="mail-item flex items-center gap-3"
              >
                <div className="flex items-center gap-3 pr-3">
                  <Checkbox 
                    checked={selectedEmails.includes(email.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEmailSelection(email.id);
                    }}
                  />
                </div>
                
                <Avatar className="size-10">
                  <AvatarImage src={email.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-lavender-200 text-lavender-700">
                    {email.from.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium truncate">{email.from}</div>
                    <div className="text-xs text-mailgray-500">{email.time}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="truncate pr-4">{email.subject}</div>
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

export default Trash;
