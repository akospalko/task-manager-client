// axios requests returning with customized data and status message responses
import axios from 'axios';
import { 
  CREATE_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS,
  DELETE_TASK_SUCCESS, 
  CREATE_TASK_FAILED,
  UPDATE_TASK_FAILED,
  DELETE_TASK_FAILED,
  GET_TASK_SUCCESS,
  GET_TASK_FAILED,
  GET_ALL_TASKS_SUCCESS,
  GET_ALL_TASKS_FAILED,
  GET_VALIDATION_SUCCESS,
  GET_VALIDATION_FAILED,
} from './statusMessages';


const baseURL = 'https://task-manager-api-ywz0.onrender.com'; //api endpoint

//GET db validation data (mongo db -> mongoose schema -> task validation data)
export const getDbValidation = async () => {
  let customResponseObj = {};
  try {
    const res = await axios.get(`${baseURL}/api/v1/schema`);
    if(String(res.status)[0] === '2') {
      customResponseObj = { data: res.data, resStatusMessage: GET_VALIDATION_SUCCESS };
    } 
  } catch (error) {
    customResponseObj = { data: {}, resStatusMessage: GET_VALIDATION_FAILED };
  }
  return customResponseObj;
}

export const getAllTasks = async () => {
  let customResponseObj = {};
  const res = await axios.get(`${baseURL}/api/v1/tasks`);
  try {
    if(String(res.status)[0] === '2') {
      customResponseObj = { data: res.data.tasks, resStatusMessage: GET_ALL_TASKS_SUCCESS };
    } 
  } catch (error) {
    customResponseObj = { data: res.data.tasks, resStatusMessage: GET_ALL_TASKS_FAILED };
  }
  return customResponseObj;
}

export const getTask = async (activeID) => {
  let customResponseObj = {};
  if(!activeID) return;
  try { 
    const res = await axios.patch(`${baseURL}/api/v1/tasks/${activeID}`)
    if(String(res.status)[0] === '2') {
      customResponseObj = { data: res.data.task, resStatus: GET_TASK_SUCCESS }
    } 
  } catch (error) {
    customResponseObj = {data: {}, resStatus: GET_TASK_FAILED}; 
  }
  return customResponseObj;
}

export const postTask = async (activeID, taskEntry) => {
  if(!activeID && !taskEntry) return;
  try {
    const res = await axios.post(`${baseURL}/api/v1/tasks`, taskEntry)
    if(String(res.status)[0] === '2') {
      return CREATE_TASK_SUCCESS; 
    } 
  } catch (error) {
      return CREATE_TASK_FAILED;
    }
}

export const patchTask = async (activeID, taskEntry) => {
  if(!activeID && !taskEntry) return;
  try { 
    const res = await axios.patch(`${baseURL}/api/v1/tasks/${activeID}`, taskEntry)
    if(String(res.status)[0] === '2') {
      return UPDATE_TASK_SUCCESS;
    } 
  } catch (error) {
    return UPDATE_TASK_FAILED; 
  }
}

export const deleteTask = async (activeID) => { 
  if(!activeID) return;
  const res = await axios.delete(`${baseURL}/api/v1/tasks/${activeID}`)
  try {
    if(String(res.status)[0] === '2') {
      return DELETE_TASK_SUCCESS;
    } 
  } catch (error) {
    return DELETE_TASK_FAILED;
  }
}