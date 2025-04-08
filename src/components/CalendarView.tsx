
import React, { useState } from "react";
import { useFamily } from "@/context/FamilyContext";
import { format, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import TaskCard from "./TaskCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";
import TaskForm from "./TaskForm";
import { DayPicker } from "react-day-picker";

const CalendarView: React.FC = () => {
  const { tasks, getFamilyMemberById } = useFamily();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const isMobile = useIsMobile();

  // Get tasks for the selected date
  const tasksOnDate = tasks.filter((task) => 
    isSameDay(new Date(task.dueDate), selectedDate)
  );

  // Create a map of dates to task counts for the month
  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const dateKey = format(new Date(task.dueDate), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {});

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const closeEditForm = () => {
    setEditingTask(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    console.log("Date selected:", date);
    if (date) {
      setSelectedDate(date);
      if (isMobile) {
        setOpenDrawer(true);
      }
    }
  };

  // Custom day content component for the calendar
  const DayContent = ({ date, displayMonth }: { date: Date; displayMonth: Date }) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayTasks = tasksByDate[dateKey] || [];
    
    if (dayTasks.length === 0) {
      return <div>{date.getDate()}</div>;
    }

    // Group tasks by assignee
    const tasksByAssignee: Record<string, number> = {};
    dayTasks.forEach(task => {
      if (!tasksByAssignee[task.assigneeId]) {
        tasksByAssignee[task.assigneeId] = 0;
      }
      tasksByAssignee[task.assigneeId]++;
    });

    return (
      <div className="flex flex-col items-center">
        <div>{date.getDate()}</div>
        <div className="flex flex-wrap justify-center gap-0.5 mt-1">
          {Object.entries(tasksByAssignee).map(([assigneeId, count], index) => {
            const member = getFamilyMemberById(assigneeId);
            if (!member) return null;
            
            return (
              <div
                key={index}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: member.color }}
                title={`${member.name}: ${count} task(s)`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // Component for displaying tasks for selected date
  const TasksForDate = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Tasks for {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" /> 
          {tasksOnDate.length} task{tasksOnDate.length !== 1 ? "s" : ""}
        </Badge>
      </div>
      
      {tasksOnDate.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No tasks scheduled for this day
        </div>
      ) : (
        <div className="space-y-3">
          {tasksOnDate.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
          ))}
        </div>
      )}

      {editingTask && (
        <TaskForm task={editingTask} onClose={closeEditForm} />
      )}
    </div>
  );

  return (
    <Card className="shadow-md border-teal-100">
      <CardHeader className="bg-teal-50 border-b border-teal-100">
        <CardTitle className="text-teal-800">Family Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <div className="rounded-md border p-0 w-full">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="pointer-events-auto"
                components={{
                  Day: (props) => {
                    // Ensure we have the date from props
                    const date = props.date;
                    if (!date) return null;
                    
                    return (
                      <button
                        {...props}
                        className={cn(
                          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 pointer-events-auto",
                          isSameDay(date, selectedDate) && "bg-teal-500 text-white"
                        )}
                        onClick={() => handleDateSelect(date)}
                      >
                        <DayContent date={date} displayMonth={props.displayMonth} />
                      </button>
                    );
                  },
                }}
              />
            </div>
          </div>

          {isMobile ? (
            <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Task Details</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-4">
                  <TasksForDate />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <div className="lg:w-1/2">
              <Card className="h-full">
                <CardContent className="p-4">
                  <TasksForDate />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
