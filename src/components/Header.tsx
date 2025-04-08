
import React from "react";
import { useFamily } from "@/context/FamilyContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { family } = useFamily();

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    window.location.href = "/auth";
  };

  return (
    <header className="bg-teal-500 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">{family.name}</h1>
          <span className="bg-white text-teal-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {family.members.length} members
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {family.members.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: member.color }}
                title={member.name}
              >
                {member.name.charAt(0)}
              </div>
            ))}
            {family.members.length > 4 && (
              <div className="w-10 h-10 rounded-full border-2 border-white bg-teal-700 flex items-center justify-center text-xs font-bold">
                +{family.members.length - 4}
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="text-white border-teal-600 bg-blue-400 hover:bg-teal-600 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
