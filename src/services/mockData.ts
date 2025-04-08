
import { Family, FamilyMember, Task } from "../types";

// Sample colors for family members
const memberColors = [
  "#14b8a6", // teal-500
  "#f59e0b", // amber-500
  "#3b82f6", // blue-500
  "#ec4899", // pink-500
  "#8b5cf6", // violet-500
  "#10b981", // emerald-500
  "#f43f5e", // rose-500
  "#6366f1", // indigo-500
];

// Sample family with members
export const initialFamily: Family = {
  id: "family-1",
  name: "The Smiths",
  members: [
    {
      id: "member-1",
      name: "Mom (Sarah)",
      color: memberColors[0],
    },
    {
      id: "member-2",
      name: "Dad (John)",
      color: memberColors[1],
    },
    {
      id: "member-3",
      name: "Emma",
      color: memberColors[2],
    },
    {
      id: "member-4",
      name: "Ethan",
      color: memberColors[3],
    },
  ],
};

// Generate today's date and some future/past dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

// Sample tasks
export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Load dishwasher",
    description: "Empty sink and load dishwasher with all dirty dishes",
    dueDate: today.toISOString(),
    assigneeId: "member-3", // Emma
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Take out trash",
    description: "Empty all trash cans and take to curb",
    dueDate: today.toISOString(),
    assigneeId: "member-4", // Ethan
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Mow the lawn",
    description: "Front and back yard",
    dueDate: tomorrow.toISOString(),
    assigneeId: "member-2", // Dad
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Grocery shopping",
    description: "Get items from the shopping list on the fridge",
    dueDate: yesterday.toISOString(),
    assigneeId: "member-1", // Mom
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Clean bathroom",
    description: "Scrub shower, sink, and toilet",
    dueDate: nextWeek.toISOString(),
    assigneeId: "member-3", // Emma
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

// Get a random color for new family members
export const getRandomMemberColor = (usedColors: string[] = []): string => {
  const availableColors = memberColors.filter(color => !usedColors.includes(color));
  if (availableColors.length === 0) return memberColors[Math.floor(Math.random() * memberColors.length)];
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};
