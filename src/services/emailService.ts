
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface EmailData {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  body: string;
  attachments?: File[];
}

export interface EmailPreferences {
  signature?: string;
  replyTo?: string;
  displayName?: string;
}

export const emailService = {
  // Send an email and store it in Supabase
  async sendEmail(emailData: EmailData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { success: false, error: "User not authenticated" };
      }
      
      const senderId = session.user.id;
      
      // Convert recipients to array
      const recipientEmails = Array.isArray(emailData.to) ? emailData.to : [emailData.to];
      
      // Get or create recipients in the users table
      const recipientIds = [];
      
      for (const email of recipientEmails) {
        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle();
          
        if (existingUser) {
          recipientIds.push(existingUser.id);
        } else {
          // Create a new user entry for the recipient
          const { data: newUser, error } = await supabase
            .from('users')
            .insert({ 
              email, 
              name: email.split('@')[0]  // Simple name from email
            })
            .select('id')
            .single();
            
          if (error || !newUser) {
            console.error("Failed to create recipient user:", error);
            continue;
          }
          
          recipientIds.push(newUser.id);
        }
      }
      
      if (recipientIds.length === 0) {
        return { success: false, error: "No valid recipients" };
      }
      
      // Store the message in the database
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          subject: emailData.subject,
          body: emailData.body,
          sender_id: senderId,
          recipient_ids: recipientIds,
          is_read: false,
        })
        .select('id')
        .single();
      
      if (error || !message) {
        console.error("Error storing message:", error);
        return { success: false, error: error?.message || "Failed to store message" };
      }
      
      // Handle attachments if present
      if (emailData.attachments && emailData.attachments.length > 0) {
        // This would need a storage bucket and attachment table handling
        // Implementation depends on your file storage approach
      }
      
      return { success: true, id: message.id };
    } catch (error: any) {
      console.error("Error in sendEmail:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Fetch emails for the current user
  async fetchEmails(folder: string = 'inbox'): Promise<any[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("User not authenticated");
        return [];
      }
      
      const userId = session.user.id;
      
      let query = supabase
        .from('messages')
        .select(`
          id,
          subject,
          body,
          created_at,
          is_read,
          is_starred,
          sender:sender_id(id, name, email)
        `);
      
      switch (folder) {
        case 'inbox':
          // Messages where the current user is a recipient
          query = query
            .contains('recipient_ids', [userId])
            .order('created_at', { ascending: false });
          break;
        case 'sent':
          // Messages sent by the current user
          query = query
            .eq('sender_id', userId)
            .order('created_at', { ascending: false });
          break;
        case 'drafts':
          // Draft implementation would require a draft status field
          break;
        case 'trash':
          // Trash implementation would require a deleted status field
          break;
        default:
          query = query.contains('recipient_ids', [userId]);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching emails:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in fetchEmails:", error);
      return [];
    }
  },
  
  // Fetch user email preferences
  async getUserPreferences(): Promise<EmailPreferences> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return {};
      }
      
      const { data, error } = await supabase
        .from('mailbox_preferences')
        .select('signature, reply_to, display_name')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user preferences:", error);
        return {};
      }
      
      return {
        signature: data?.signature,
        replyTo: data?.reply_to,
        displayName: data?.display_name
      };
    } catch (error) {
      console.error("Error in getUserPreferences:", error);
      return {};
    }
  },
  
  // Update user email preferences
  async updateUserPreferences(prefs: EmailPreferences): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }
      
      // Check if preferences exist for this user
      const { data: existingPrefs } = await supabase
        .from('mailbox_preferences')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      const updateData = {
        user_id: session.user.id,
        signature: prefs.signature || null,
        reply_to: prefs.replyTo || null,
        display_name: prefs.displayName || null,
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (existingPrefs) {
        // Update existing preferences
        result = await supabase
          .from('mailbox_preferences')
          .update(updateData)
          .eq('user_id', session.user.id);
      } else {
        // Insert new preferences
        result = await supabase
          .from('mailbox_preferences')
          .insert(updateData);
      }
      
      if (result.error) {
        console.error("Error updating preferences:", result.error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateUserPreferences:", error);
      return false;
    }
  },
  
  // Mark message as read
  async markAsRead(messageId: string, isRead: boolean = true): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: isRead })
        .eq('id', messageId);
      
      return !error;
    } catch (error) {
      console.error("Error marking message as read:", error);
      return false;
    }
  },
  
  // Toggle star status on a message
  async toggleStar(messageId: string, isStarred: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_starred: isStarred })
        .eq('id', messageId);
      
      return !error;
    } catch (error) {
      console.error("Error toggling star status:", error);
      return false;
    }
  }
};
