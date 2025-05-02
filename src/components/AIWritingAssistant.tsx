
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Loader2, Copy } from "lucide-react";

interface AIWritingAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertText: (text: string) => void;
}

const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  open,
  onOpenChange,
  onInsertText,
}) => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const promptSuggestions = [
    "Write a professional email to schedule a team meeting",
    "Draft a follow-up email for a client who hasn't responded",
    "Compose a thank you email to a colleague",
    "Write a project status update email",
    "Create a formal business proposal",
  ];

  const generateEmailText = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt or select a suggestion",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulated AI response - in a real app, this would call an API
    setTimeout(() => {
      // Generate mock AI response based on the prompt
      let response = "";
      
      if (prompt.includes("meeting") || prompt.includes("schedule")) {
        response = `Subject: Team Meeting - Weekly Status Update\n\nDear Team,\n\nI hope this email finds you well. I'd like to schedule our weekly status update meeting for Friday, May 5th at 10:00 AM (EST) via Zoom.\n\nAgenda:\n1. Project updates\n2. Upcoming milestones\n3. Resource allocation\n4. Open discussion\n\nPlease come prepared to share updates on your current tasks and any challenges you might be facing. If you cannot attend, kindly let me know in advance.\n\nBest regards,\n[Your Name]`;
      } else if (prompt.includes("follow-up") || prompt.includes("client")) {
        response = `Subject: Follow-up on Our Recent Discussion\n\nDear [Client Name],\n\nI hope you're doing well. I'm writing to follow up on our meeting last week regarding [project/service]. We discussed [key points], and I wanted to check if you have any further questions or if you've made a decision regarding our proposal.\n\nI'm available to schedule another call if you would like to discuss any aspects in more detail. Please feel free to reach out at your convenience.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]`;
      } else if (prompt.includes("thank you") || prompt.includes("thanks")) {
        response = `Subject: Thank You for Your Support\n\nDear [Name],\n\nI wanted to take a moment to express my sincere gratitude for your recent assistance with [specific task/project]. Your expertise and willingness to help made a significant difference in [outcome].\n\nI truly appreciate your dedication and the time you took to [specific action they took]. It demonstrates your commitment to our team's success.\n\nThank you again for your valuable contribution.\n\nWarm regards,\n[Your Name]`;
      } else if (prompt.includes("status") || prompt.includes("update")) {
        response = `Subject: Project Status Update - [Project Name]\n\nDear [Recipient],\n\nI'm writing to provide you with an update on our progress with [project name].\n\nCurrent Status:\n- We have completed [X%] of the planned deliverables\n- [Key milestone] was achieved on schedule\n- The team is currently working on [current task]\n\nChallenges:\n- [Brief description of any challenges]\n\nNext Steps:\n- [Next milestone] is scheduled for completion by [date]\n- We will need [resources/input] to proceed with [next phase]\n\nPlease let me know if you require any additional information or have any questions.\n\nBest regards,\n[Your Name]`;
      } else {
        response = `Subject: Regarding [Topic]\n\nDear [Recipient],\n\nI hope this email finds you well. I'm writing to discuss [brief description of purpose].\n\n[Main content of the email with relevant details, organized into paragraphs]\n\n[Closing paragraph with clear next steps or call to action]\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]`;
      }
      
      setGeneratedText(response);
      setIsLoading(false);
    }, 1500);
  };

  const handleInsert = () => {
    onInsertText(generatedText);
    onOpenChange(false);
    toast({
      title: "Text inserted",
      description: "The AI-generated text has been added to your email",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied to clipboard",
      description: "The AI-generated text has been copied",
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-aivia-medium-purple" />
            AI Writing Assistant
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4">
              <Textarea
                placeholder="Describe what kind of email you want to write..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={generateEmailText} 
                  disabled={isLoading || !prompt}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Email"
                  )}
                </Button>
              </div>
              
              {generatedText && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Generated Email:</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button size="sm" onClick={handleInsert}>
                        Insert into Email
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border bg-muted/50 p-4 whitespace-pre-wrap">
                    {generatedText}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions">
            <div className="grid gap-2">
              {promptSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AIWritingAssistant;
