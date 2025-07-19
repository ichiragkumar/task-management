export enum PROJECT_STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export enum TASK_STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface Project {
  id: string;
  name: string;
  status: PROJECT_STATUS;
}

export interface Task {
  id: string;
  name: string;
  status: TASK_STATUS;
  projectId: string;
}