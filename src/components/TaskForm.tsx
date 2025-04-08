
import React, { useState, useEffect } from "react";
import { useFamily } from "@/context/FamilyContext";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { family, addTask, updateTask } = useFamily();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form if editing an existing task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(new Date(task.dueDate));
      setAssigneeId(task.assigneeId);
      setPriority(task.priority || "medium");
    } else if (family.members.length > 0) {
      // Set default assignee to first family member
      setAssigneeId(family.members[0].id);
    }
  }, [task, family.members]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!assigneeId) {
      newErrors.assigneeId = "Please select a family member";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (task) {
      // Update existing task
      updateTask(task.id, {
        title,
        description: description || undefined,
        dueDate: dueDate.toISOString(),
        assigneeId,
        priority,
      });
    } else {
      // Create new task
      addTask({
        title,
        description: description || undefined,
        dueDate: dueDate.toISOString(),
        assigneeId,
        completed: false,
        priority,
      });
    }
    
    onClose();
  };

  return (
    <Card className="border-teal-200 shadow-md">
      <CardHeader className="bg-teal-50 border-b border-teal-100">
        <CardTitle>{task ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Task Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the task..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">
              Assign To <span className="text-red-500">*</span>
            </Label>
            <Select
              value={assigneeId}
              onValueChange={setAssigneeId}
            >
              <SelectTrigger className={cn(errors.assigneeId && "border-red-500")}>
                <SelectValue placeholder="Select a family member" />
              </SelectTrigger>
              <SelectContent>
                {family.members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: member.color }}
                      />
                      {member.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assigneeId && (
              <p className="text-sm text-red-500">{errors.assigneeId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => setDueDate(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 py-3 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {task ? "Update Task" : "Create Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TaskForm;
