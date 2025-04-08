
import React, { useState } from "react";
import { useFamily } from "@/context/FamilyContext";
import TaskCard from "./TaskCard";
import { Task } from "@/types";
import TaskForm from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Plus, ArrowDown, ArrowUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TaskList: React.FC = () => {
  const { tasks } = useFamily();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  const openTaskForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const closeTaskForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return sortAscending ? dateA - dateB : dateB - dateA;
  });

  // Filter tasks for each tab
  const pendingTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter for overdue tasks
  const overdueTasks = pendingTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Family Tasks</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortAscending(!sortAscending)}
            className="flex items-center gap-1"
          >
            Sort {sortAscending ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </Button>
          <Button onClick={openTaskForm} className="flex items-center gap-1">
            <Plus size={16} /> Add Task
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <TaskForm task={editingTask} onClose={closeTaskForm} />
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All ({pendingTasks.length})
          </TabsTrigger>
          {overdueTasks.length > 0 && (
            <TabsTrigger value="overdue" className="text-red-500">
              Overdue ({overdueTasks.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No pending tasks. Time to add some chores!</p>
              <Button onClick={openTaskForm} variant="outline" className="mt-2">
                Add Your First Task
              </Button>
            </div>
          ) : (
            pendingTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
            ))
          )}
        </TabsContent>

        <TabsContent value="overdue">
          {overdueTasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
          ))}
        </TabsContent>

        <TabsContent value="completed">
          {completedTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No completed tasks yet. Keep working!</p>
            </div>
          ) : (
            completedTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
