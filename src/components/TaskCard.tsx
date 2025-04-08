
import React from "react";
import { Task } from "@/types";
import { useFamily } from "@/context/FamilyContext";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { getFamilyMemberById, toggleTaskCompletion, removeTask } = useFamily();
  const assignee = getFamilyMemberById(task.assigneeId);
  
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isPastDue = !task.completed && dueDate < today;
  const isDueToday = !isPastDue && 
    dueDate.getDate() === today.getDate() && 
    dueDate.getMonth() === today.getMonth() && 
    dueDate.getFullYear() === today.getFullYear();

  const handleToggleComplete = () => {
    toggleTaskCompletion(task.id);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this task?")) {
      removeTask(task.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high": return "text-red-600 bg-red-100 border-red-300";
      case "medium": return "text-amber-600 bg-amber-100 border-amber-300";
      case "low": return "text-blue-600 bg-blue-100 border-blue-300";
      default: return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getPriorityLabel = () => {
    switch (task.priority) {
      case "high": return "H: High";
      case "medium": return "M: Medium";
      case "low": return "L: Low";
      default: return "M: Medium";
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 transition-all hover:shadow-lg",
        task.completed 
          ? "border-green-500 bg-green-50" 
          : isPastDue 
            ? "border-red-500" 
            : isDueToday 
              ? "border-amber-500" 
              : "border-blue-500"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
            className={cn(
              "border-2 h-5 w-5",
              task.completed && "animate-task-complete"
            )}
          />
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "text-lg font-medium mb-1",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={cn(
              "text-gray-600 text-sm mb-2",
              task.completed && "text-gray-400"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.priority && (
              <Badge 
                variant="outline" 
                className={cn("flex items-center gap-1", getPriorityColor())}
              >
                {getPriorityLabel()}
              </Badge>
            )}
            
            {assignee && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
                style={{
                  backgroundColor: assignee.color ? `${assignee.color}20` : undefined,
                  borderColor: assignee.color,
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: assignee.color }}
                />
                {assignee.name}
              </Badge>
            )}
            
            <Badge 
              variant={isPastDue ? "destructive" : isDueToday ? "secondary" : "outline"}
            >
              {isPastDue ? "Overdue: " : "Due: "}
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleEdit}
          >
            <Edit size={16} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive/80"
            onClick={handleRemove}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
