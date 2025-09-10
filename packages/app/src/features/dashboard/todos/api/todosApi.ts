import type {
  CreateResolution,
  ProjectNames,
  TodoResolution,
  TodosInfo,
} from '@dev-dashboard/shared';
import { protectedClient } from '../../../../lib/api';

const getLatest = async (): Promise<TodosInfo> => {
  const response = await protectedClient.get('/todos/latest');
  return response.data;
};

const getProjectNames = async (): Promise<ProjectNames> => {
  const response = await protectedClient.get('/todos/projects');
  return response.data;
};

const getByProject = async (projectName: string): Promise<TodosInfo> => {
  const response = await protectedClient.get(`/todos/projects/${projectName}`);
  return response.data;
};

const getPendingResolutions = async (): Promise<TodoResolution[]> => {
  const response = await protectedClient.get('/todos/resolutions/pending');
  return response.data;
};

const postResolutions = async (
  resolutions: CreateResolution[]
): Promise<TodoResolution[]> => {
  const response = await protectedClient.post(
    '/todos/resolutions/resolve',
    resolutions
  );
  return response.data;
};

export {
  getLatest,
  getProjectNames,
  getByProject,
  getPendingResolutions,
  postResolutions,
};
