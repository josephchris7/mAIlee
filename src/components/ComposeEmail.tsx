
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Send, Trash, Sparkles } from "lucide-react";
import AIWritingAssistant from "./AIWritingAssistant";
import ScheduleCalendar from "./ScheduleCalendar";

interface ComposeEmailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComposeEmail: React.FC<ComposeEmailProps> = ({ open, onOpenChange }) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const { toast } = useToast();

  const handleSend = () => {
    if (!to) {
      toast({
        title: "Missing recipient",
        description: "Please specify at least one recipient",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send the email via an API
    toast({
      title: "Email sent",
      description: `Your email to ${to} has been sent successfully.`,
    });
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  const handleDiscard = () => {
    // Check if there's content to discard
    if (to || subject || body) {
      toast({
        title: "Draft discarded",
        description: "Your email draft has been discarded",
      });
    }
    
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setBody("");
    setShowCcBcc(false);
  };

  const insertTextFromAI = (text: string) => {
    setBody(text);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="to">To</Label>
                {!showCcBcc && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => setShowCcBcc(true)}
                  >
                    Add Cc/Bcc
                  </Button>
                )}
              </div>
              <Input
                id="to"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            
            {showCcBcc && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="cc">Cc</Label>
                  <Input
                    id="cc"
                    placeholder="cc@example.com"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bcc">Bcc</Label>
                  <Input
                    id="bcc"
                    placeholder="bcc@example.com"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="body">Message</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCalendar(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Schedule Call
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAIAssistant(true)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Assistant
                  </Button>
                </div>
              </div>
              <Textarea
                id="body"
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleDiscard}>
              <Trash className="mr-2 h-4 w-4" />
              Discard
            </Button>
            <Button onClick={handleSend}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AIWritingAssistant 
        open={showAIAssistant} 
        onOpenChange={setShowAIAssistant} 
        onInsertText={insertTextFromAI} 
      />
      
      <ScheduleCalendar 
        open={showCalendar}
        onOpenChange={setShowCalendar}
      />
    </>
  );
};

export default ComposeEmail;
