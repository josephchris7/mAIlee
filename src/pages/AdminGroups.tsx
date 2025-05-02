
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Sample data
const initialGroups = [
  { 
    id: "group-1", 
    name: "Executive Team", 
    description: "Company executives and leadership", 
    memberCount: 5, 
    created: "01/15/2023" 
  },
  { 
    id: "group-2", 
    name: "Marketing", 
    description: "Marketing and communications team", 
    memberCount: 8, 
    created: "02/22/2023" 
  },
  { 
    id: "group-3", 
    name: "Engineering", 
    description: "Software development team", 
    memberCount: 12, 
    created: "03/10/2023" 
  },
  { 
    id: "group-4", 
    name: "Customer Support", 
    description: "Support and service representatives", 
    memberCount: 6, 
    created: "05/05/2023" 
  }
];

const AdminGroups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState(initialGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send a request to your API
    const newId = `group-${groups.length + 1}`;
    setGroups([
      ...groups,
      {
        id: newId,
        name: newGroup.name,
        description: newGroup.description,
        memberCount: 0,
        created: new Date().toLocaleDateString()
      }
    ]);
    
    setNewGroup({
      name: "",
      description: "",
    });
    
    setIsOpen(false);
    
    toast({
      title: "Group created",
      description: `${newGroup.name} has been created successfully`,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-lavender-700 dark:text-lavender-300">Email Groups</h1>
          <p className="text-mailgray-600 dark:text-mailgray-400">
            Manage distribution groups and mailing lists
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lavender-600 hover:bg-lavender-700">
              <Users className="mr-2 size-4" />
              New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Add a new email distribution group or mailing list.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddGroup}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="Development Team"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Software development team members"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-lavender-600 hover:bg-lavender-700">
                  Create Group
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Email Groups</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mailgray-400 size-4" />
              <Input 
                placeholder="Search groups..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Showing {filteredGroups.length} of {groups.length} total groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{group.memberCount} members</Badge>
                  </TableCell>
                  <TableCell>{group.created}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGroups;
