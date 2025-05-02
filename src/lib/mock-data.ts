
interface Email {
  id: string;
  from: string;
  email: string;
  subject: string;
  content: string;
  time: string;
  unread: boolean;
  important: boolean;
  avatar?: string;
}

// Sample names for email generation
const senderNames = [
  "Alex Morgan", "Taylor Chen", "Jordan Smith", "Casey Lopez", 
  "Riley Johnson", "Morgan Williams", "Jamie Davis", "Quinn Garcia", 
  "Sam Rodriguez", "Jordan Wilson"
];

const emailDomains = [
  "gmail.com", "outlook.com", "yahoo.com", "company.com", 
  "example.org", "tech.io", "mail.co", "proton.me"
];

const emailSubjects = [
  "Meeting scheduled for next week",
  "Project update: AI Integration",
  "Important announcement from the team",
  "Your subscription is about to expire",
  "Invoice for services rendered",
  "Follow up on our conversation",
  "New feature release notes",
  "Security alert: Please confirm login",
  "Training session: Advanced AI techniques",
  "Team building event next month",
  "Quarterly report is now available",
  "Account verification required",
  "Your opinion matters: take our survey",
  "Congratulations on your milestone!",
  "Action required: update your preferences"
];

const emailContentSnippets = [
  "I wanted to follow up on our discussion about the upcoming project timeline...",
  "Please review the attached documents and provide your feedback by Friday...",
  "The team has made significant progress on the AI implementation. Here's what we've accomplished...",
  "We're excited to announce the launch of our new service that will revolutionize how we...",
  "Thank you for your recent purchase. Your order has been processed and will be delivered...",
  "I have reviewed the proposal and have some suggestions for improvements that could help us...",
  "The system maintenance is scheduled for this weekend. Please expect some downtime during...",
  "Congratulations on achieving the quarterly targets! The executive team would like to recognize...",
  "We've updated our privacy policy to comply with recent regulations. Please review the changes...",
  "The client has requested additional features for the project. We need to discuss how to incorporate..."
];

const generateRandomTime = (): string => {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 24);
  const daysAgo = Math.floor(Math.random() * 7);
  
  if (hoursAgo < 1) {
    return "Just now";
  } else if (hoursAgo < 24) {
    return `${hoursAgo}h ago`;
  } else {
    return `${daysAgo}d ago`;
  }
};

export const generateMockEmails = (count: number): Email[] => {
  const emails: Email[] = [];
  
  for (let i = 0; i < count; i++) {
    const senderName = senderNames[Math.floor(Math.random() * senderNames.length)];
    const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    const email = `${senderName.toLowerCase().replace(/\s/g, '.')}@${domain}`;
    const subject = emailSubjects[Math.floor(Math.random() * emailSubjects.length)];
    const content = emailContentSnippets[Math.floor(Math.random() * emailContentSnippets.length)];
    
    emails.push({
      id: `email-${Date.now()}-${i}`,
      from: senderName,
      email,
      subject,
      content,
      time: generateRandomTime(),
      unread: Math.random() > 0.7, // 30% chance of being unread
      important: Math.random() > 0.8, // 20% chance of being important
    });
  }
  
  return emails;
};

export const generateMockUsers = (count: number) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const name = senderNames[Math.floor(Math.random() * senderNames.length)];
    const domain = "yourcompany.com";
    const email = `${name.toLowerCase().replace(/\s/g, '.')}@${domain}`;
    
    users.push({
      id: `user-${i+1}`,
      name,
      email,
      role: i === 0 ? "Admin" : "User",
      status: Math.random() > 0.2 ? "Active" : "Inactive",
      created: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
        .toLocaleDateString()
    });
  }
  
  return users;
};
