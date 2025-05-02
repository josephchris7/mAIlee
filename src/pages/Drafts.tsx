
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, FileText } from "lucide-react";

const draftEmails = [
  {
    id: "draft-1",
    subject: "Weekly project update",
    lastEdited: "2 hours ago",
    content: "Here's the weekly update on our AI project. We've made significant progress on..."
  },
  {
    id: "draft-2",
    subject: "Meeting agenda for tomorrow",
    lastEdited: "Yesterday",
    content: "Proposed agenda items for tomorrow's team meeting: 1. Project status updates..."
  },
  {
    id: "draft-3",
    subject: "Proposal for new client",
    lastEdited: "3 days ago",
    content: "I've outlined our proposal for the potential new client. Key points include..."
  }
];

const Drafts = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white dark:bg-mailgray-900 shadow-sm p-3 flex items-center justify-between">
        <h2 className="text-lg font-medium text-lavender-700 dark:text-lavender-300">Drafts</h2>
      </div>
      
      {/* Drafts list */}
      <div className="flex-1 overflow-auto">
        {draftEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-mailgray-500">
            <FileText className="size-16 text-lavender-300 mb-4" />
            <h3 className="text-xl font-medium">No drafts saved</h3>
            <p>Start composing new emails to create drafts</p>
          </div>
        ) : (
          <div className="divide-y divide-lavender-100 dark:divide-mailgray-800">
            {draftEmails.map((draft) => (
              <div 
                key={draft.id} 
                className="p-4 hover:bg-lavender-50 dark:hover:bg-mailgray-900/50 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">{draft.subject || "(No subject)"}</h3>
                  <Button size="sm" variant="outline" className="text-lavender-600">
                    <Edit2 className="size-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="text-sm text-mailgray-500 mb-2">
                  Last edited: {draft.lastEdited}
                </div>
                
                <div className="text-mailgray-600 dark:text-mailgray-300">
                  {draft.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drafts;
