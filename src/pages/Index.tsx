
import React, { useState } from "react";
import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import FamilyMembers from "@/components/FamilyMembers";
import Dashboard from "@/components/Dashboard";
import CalendarView from "@/components/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, ListTodo, Home } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListTodo size={16} />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays size={16} />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TaskList />
              </div>
              <div>
                <FamilyMembers />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="w-full">
              <CalendarView />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>Chore Crew Organizer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
