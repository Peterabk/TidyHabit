
import React, { useState } from "react";
import { useFamily } from "@/context/FamilyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FamilyMembers: React.FC = () => {
  const { family, tasks, addFamilyMember, removeFamilyMember, getTasksByMemberId } = useFamily();
  const [newMemberName, setNewMemberName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      addFamilyMember(newMemberName.trim());
      setNewMemberName("");
      setIsAdding(false);
    }
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the family?`)) {
      removeFamilyMember(id);
    }
  };

  return (
    <Card className="border-teal-200 shadow-md">
      <CardHeader className="bg-teal-50 border-b border-teal-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users size={18} />
              Family Members
            </CardTitle>
            <CardDescription>Manage your family crew</CardDescription>
          </div>
          {!isAdding && (
            <Button 
              onClick={() => setIsAdding(true)} 
              size="sm"
              className="flex items-center gap-1"
            >
              <UserPlus size={16} />
              Add Member
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isAdding && (
          <form onSubmit={handleAddMember} className="flex gap-2 mb-4">
            <Input
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit">Add</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsAdding(false);
                setNewMemberName("");
              }}
            >
              Cancel
            </Button>
          </form>
        )}

        {family.members.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="mb-2">No family members yet.</p>
            {!isAdding && (
              <Button 
                variant="outline" 
                onClick={() => setIsAdding(true)}
                size="sm"
              >
                Add Your First Family Member
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {family.members.map((member) => {
              const memberTasks = getTasksByMemberId(member.id);
              const completedTasks = memberTasks.filter(task => task.completed).length;
              
              return (
                <li 
                  key={member.id} 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Tasks: {memberTasks.length}
                        </Badge>
                        {memberTasks.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-green-50">
                            Completed: {completedTasks}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    className="text-gray-500 hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyMembers;
