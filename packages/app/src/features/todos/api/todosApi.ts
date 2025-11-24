import { protectedClient } from '../../../lib/api';
import type {
  CreateResolution,
  ProjectNames,
  TodoResolution,
  TodosInfo,
  TodosInfoWithResolved,
} from '@dev-dashboard/shared';

export const fetchLatestTodos = async (): Promise<TodosInfo> => {
  const response = await protectedClient.get('/todos/batches/latest');

  if (response.status !== 200) {
    throw new Error(`Failed to fetch latest todos: ${response.status}`);
  }

  return response.data;
};

export const fetchProjectNames = async (): Promise<ProjectNames> => {
  const response = await protectedClient.get('/todos/projects');

  if (response.status !== 200) {
    throw new Error(`Failed to fetch project names: ${response.status}`);
  }

  return response.data;
};

export const fetchTodosByProject = async (
  projectName: string
): Promise<TodosInfoWithResolved> => {
  if (!projectName || projectName.trim() === '') {
    throw new Error('Project name is required');
  }

  const response = await protectedClient.get(
    `/todos/projects/${encodeURIComponent(projectName)}/batches`
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch todos for project: ${response.status}`);
  }

  return response.data;
};

export const fetchPendingResolutions = async (): Promise<TodoResolution[]> => {
  const response = await protectedClient.get('/todos/resolutions/pending');

  if (response.status !== 200) {
    throw new Error(`Failed to fetch pending resolutions: ${response.status}`);
  }

  if (!Array.isArray(response.data)) {
    throw new Error('Invalid response: expected array of resolutions');
  }

  return response.data;
};

export const createResolutions = async (
  resolutions: CreateResolution[]
): Promise<TodoResolution[]> => {
  if (!Array.isArray(resolutions) || resolutions.length === 0) {
    throw new Error('Resolutions array is required and cannot be empty');
  }

  const response = await protectedClient.post(
    '/todos/resolutions',
    resolutions
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Failed to create resolutions: ${response.status}`);
  }

  if (!Array.isArray(response.data)) {
    throw new Error('Invalid response: expected array of resolutions');
  }

  return response.data;
};

export const fetchResolvedTodos = async (): Promise<TodoResolution[]> => {
  const response = await protectedClient.get('/todos/resolutions');

  if (response.status !== 200) {
    throw new Error(`Failed to fetch resolved todos: ${response.status}`);
  }

  if (!Array.isArray(response.data)) {
    throw new Error('Invalid response: expected array of resolutions');
  }

  return response.data;
};
