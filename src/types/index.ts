
export interface Family {
  id: string;
  name: string;
  members: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  assigneeId: string;
  completed: boolean;
  createdAt: string;
  priority?: "low" | "medium" | "high";
}
