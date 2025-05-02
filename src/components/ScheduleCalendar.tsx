
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Clock, Users } from "lucide-react";

type ScheduledCall = {
  id: string;
  title: string;
  date: Date;
  time: string;
  participants: string[];
};

interface ScheduleCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  open,
  onOpenChange,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!date || !time || !title || !participants) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to schedule a call",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would save to a database
    const newCall: ScheduledCall = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      date,
      time,
      participants: participants.split(',').map(p => p.trim()),
    };
    
    toast({
      title: "Call scheduled",
      description: `${title} scheduled for ${format(date, "PPP")} at ${time}`,
    });
    
    // Reset form and close dialog
    setTitle("");
    setParticipants("");
    onOpenChange(false);
  };

  const timeSlots = [];
  for (let i = 9; i <= 17; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Call</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Team weekly sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="size-4" /> 
              Date
            </Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="rounded-md border"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="size-4" /> 
              Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="participants" className="flex items-center gap-2">
              <Users className="size-4" /> 
              Participants
            </Label>
            <Input
              id="participants"
              placeholder="email1@example.com, email2@example.com"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSchedule}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleCalendar;
