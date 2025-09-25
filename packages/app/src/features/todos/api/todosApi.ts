import { protectedClient } from '../../../lib/api';
import type {
  CreateResolution,
  ProjectNames,
  TodoResolution,
  TodosInfo,
} from '@dev-dashboard/shared';

const getLatest = async (): Promise<TodosInfo> => {
  const response = await protectedClient.get('/todos/batches/latest');
  return response.data;
};

const getProjectNames = async (): Promise<ProjectNames> => {
  const response = await protectedClient.get('/todos/projects');
  return response.data;
};

const getByProject = async (projectName: string): Promise<TodosInfo> => {
  const response = await protectedClient.get(
    `/todos/projects/${projectName}/batches`
  );
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
    '/todos/resolutions',
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
