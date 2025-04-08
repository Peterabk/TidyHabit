
import React, { useMemo } from "react";
import { useFamily } from "@/context/FamilyContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, isSameDay, isAfter, isBefore, parseISO } from "date-fns";

const Dashboard: React.FC = () => {
  const { tasks } = useFamily();
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });
  
  // Find tasks due today
  const dueTodayTasks = tasks.filter(task => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === today.toDateString();
  });

  // Generate data for the completion chart
  const chartData = useMemo(() => {
    // Get the last 14 days
    const days = Array.from({ length: 14 }, (_, i) => subDays(today, 13 - i));
    
    return days.map(day => {
      // Find tasks completed on this day
      const completedOnDay = tasks.filter(task => {
        if (!task.completed) return false;
        // Check if the task was completed on this day
        // For simplicity, we're using the task's due date since we don't have a completedAt field
        const taskDate = parseISO(task.dueDate);
        return isSameDay(taskDate, day);
      }).length;

      return {
        date: format(day, "MMM dd"),
        completed: completedOnDay,
      };
    });
  }, [tasks, today]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
              <Check size={18} /> Task Completion
            </CardTitle>
            <CardDescription>Overall task status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{completionRate}%</div>
              <div className="text-sm text-gray-500">
                {completedTasks} of {totalTasks} completed
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-teal-500 h-2.5 rounded-full"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-amber-500 flex items-center gap-2">
              <Clock size={18} /> Due Today
            </CardTitle>
            <CardDescription>Tasks needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueTodayTasks.length}</div>
            <p className="text-sm text-gray-500">
              {dueTodayTasks.length === 0
                ? "No tasks due today!"
                : dueTodayTasks.length === 1
                ? "1 task needs to be completed today"
                : `${dueTodayTasks.length} tasks need to be completed today`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-500 flex items-center gap-2">
              <AlertTriangle size={18} /> Overdue
            </CardTitle>
            <CardDescription>Tasks past their due date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks.length}</div>
            <p className="text-sm text-gray-500">
              {overdueTasks.length === 0
                ? "No overdue tasks!"
                : overdueTasks.length === 1
                ? "1 task is overdue"
                : `${overdueTasks.length} tasks are overdue`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Completion Over Time</CardTitle>
          <CardDescription>Number of tasks completed each day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3} 
                  name="Tasks Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
