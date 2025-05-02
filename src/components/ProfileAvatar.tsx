
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Upload, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileAvatarProps {
  onLogout: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Maximum file size: 1MB
  const MAX_FILE_SIZE = 1 * 1024 * 1024; 
  
  // Get user initials for the avatar fallback
  const getUserInitials = (): string => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }
    
    // Check file size (limit to 1MB)
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 1MB",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }
    
    // Create a URL for the image
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarSrc(reader.result as string);
      setIsUploading(false);
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been uploaded successfully",
      });
    };
    
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload your profile photo. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleDeleteAvatar = () => {
    setAvatarSrc(null);
    toast({
      title: "Profile photo deleted",
      description: "Your profile photo has been removed",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-9 rounded-full">
          <Avatar className="size-9">
            <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-primary/20 text-primary-foreground dark:bg-primary/30 dark:text-primary-foreground">
              {getUserInitials()}
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
        <DropdownMenuItem>
          <label htmlFor="avatar-upload" className="flex w-full cursor-pointer items-center">
            <Upload className="mr-2 size-4" />
            <span>Upload photo</span>
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </label>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDeleteAvatar} 
          disabled={!avatarSrc}
          className={!avatarSrc ? "text-muted-foreground cursor-not-allowed" : "cursor-pointer"}
        >
          <Trash className="mr-2 size-4" />
          <span>Delete photo</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400 cursor-pointer">
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileAvatar;
