
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Family, FamilyMember, Task } from "../types";
import { initialFamily, initialTasks, getRandomMemberColor } from "../services/mockData";
import { toast } from "@/components/ui/use-toast";

interface FamilyContextType {
  family: Family;
  tasks: Task[];
  addFamilyMember: (name: string) => void;
  removeFamilyMember: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getFamilyMemberById: (id: string) => FamilyMember | undefined;
  getTasksByMemberId: (memberId: string) => Task[];
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [family, setFamily] = useState<Family>(initialFamily);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedFamily = localStorage.getItem("family");
    const savedTasks = localStorage.getItem("tasks");

    if (savedFamily) {
      setFamily(JSON.parse(savedFamily));
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("family", JSON.stringify(family));
  }, [family]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addFamilyMember = (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Member name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const usedColors = family.members.map(member => member.color).filter(Boolean) as string[];
    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name,
      color: getRandomMemberColor(usedColors),
    };

    setFamily(prevFamily => ({
      ...prevFamily,
      members: [...prevFamily.members, newMember],
    }));

    toast({
      title: "Success",
      description: `${name} added to family`,
    });
  };

  const removeFamilyMember = (id: string) => {
    // Check if member has tasks
    const memberTasks = tasks.filter(task => task.assigneeId === id);
    if (memberTasks.length > 0) {
      if (!confirm(`This member has ${memberTasks.length} tasks. Removing them will delete their tasks. Continue?`)) {
        return;
      }
      // Remove tasks assigned to this member
      setTasks(prevTasks => prevTasks.filter(task => task.assigneeId !== id));
    }

    setFamily(prevFamily => ({
      ...prevFamily,
      members: prevFamily.members.filter(member => member.id !== id),
    }));

    toast({
      title: "Member removed",
      description: "Family member and their tasks have been removed",
    });
  };

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setTasks(prevTasks => [...prevTasks, newTask]);

    toast({
      title: "Task added",
      description: `"${task.title}" assigned to ${getFamilyMemberById(task.assigneeId)?.name}`,
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );

    toast({
      title: "Task updated",
      description: "Task has been updated successfully",
    });
  };

  const removeTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

    toast({
      title: "Task removed",
      description: "Task has been removed successfully",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      toast({
        title: newStatus ? "Task completed" : "Task reopened",
        description: newStatus 
          ? `Great job on completing "${task.title}"!` 
          : `"${task.title}" marked as not completed`,
      });
    }
  };

  const getFamilyMemberById = (id: string) => {
    return family.members.find(member => member.id === id);
  };

  const getTasksByMemberId = (memberId: string) => {
    return tasks.filter(task => task.assigneeId === memberId);
  };

  return (
    <FamilyContext.Provider
      value={{
        family,
        tasks,
        addFamilyMember,
        removeFamilyMember,
        addTask,
        updateTask,
        removeTask,
        toggleTaskCompletion,
        getFamilyMemberById,
        getTasksByMemberId,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = (): FamilyContextType => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
};
