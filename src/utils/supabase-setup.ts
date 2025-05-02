
import { supabase } from '../../supabaseClient';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// User management functions
export const userManagement = {
  createUser: async (userData: any) => {
    try {
      console.log("Creating user with data:", userData);
      
      // First register the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }
      
      if (!authData.user?.id) {
        throw new Error("User creation failed. No user ID returned.");
      }
      
      console.log("Auth user created:", authData.user.id);
      
      // Then add the user to our users table with additional info
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'User',
          status: 'Active',
          created_at: new Date().toISOString(),
        }]);
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("User created successfully");
      return { id: authData.user.id };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  updateUser: async (id: string, userData: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id);
      
      if (error) throw error;
      
      return { id };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      // Only set the user to inactive rather than a hard delete
      const { data, error } = await supabase
        .from('users')
        .update({ status: 'Inactive' })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  listUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error listing users:', error);
      return [];
    }
  }
};

// Email management functions
export const emailManagement = {
  sendEmail: async (emailData: any) => {
    try {
      const { data, error } = await supabase
        .from('emails')
        .insert([{
          from_id: emailData.fromId,
          to_email: emailData.to,
          subject: emailData.subject,
          content: emailData.content,
          sent_at: new Date(),
          status: 'sent',
        }]);
      
      if (error) throw error;
      
      return { id: data?.[0]?.id };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
  
  fetchEmails: async (userId: string, folder: string) => {
    try {
      let query = supabase
        .from('emails')
        .select('*, sender:from_id(name, email)');
      
      // Adjust query based on folder
      switch (folder) {
        case 'inbox':
          query = query.eq('to_id', userId).eq('status', 'received');
          break;
        case 'sent':
          query = query.eq('from_id', userId).eq('status', 'sent');
          break;
        case 'drafts':
          query = query.eq('from_id', userId).eq('status', 'draft');
          break;
        case 'trash':
          query = query.eq('to_id', userId).eq('status', 'deleted');
          break;
        default:
          query = query.eq('to_id', userId).eq('status', 'received');
      }
      
      const { data, error } = await query.order('sent_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching emails:', error);
      return [];
    }
  }
};
