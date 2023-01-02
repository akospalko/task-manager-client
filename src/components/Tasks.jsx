import React, { useEffect, useCallback } from 'react'
import { getAllTasks } from '../helper/axiosRequests';
import Task from './Task';
import './Tasks.css';
import { TASKS_LIST_EMPTY } from '../helper/statusMessages';
import { useFormDataContext } from '../contexts/FormDataContext';
import { useLoaderContext } from '../contexts/LoaderContext';
import updateState from '../helper/updateState';
import Loader from './Loader';

export default function Tasks() {
  const { 
    isSubmittingForm, 
    data, 
    setData,
    setStatusMessage
  } = useFormDataContext();
  const { isLoading, setIsLoading } = useLoaderContext();
  //fetch data memoized fn
  let fetchAllData = useCallback(async (toggleLoader) => {
    updateState(toggleLoader, 'getAllTasks', true); 
    const response = await getAllTasks();
    const {data:taskData, resStatusMessage } = response;
    setData(taskData);
    updateState(setStatusMessage, 'getAllTasks', resStatusMessage);
    updateState(toggleLoader, 'getAllTasks', false); 
  }, [setData, setStatusMessage])

  //fetch data on first run
  useEffect(() => {
    fetchAllData(setIsLoading);
  }, [fetchAllData, setIsLoading])

  //refetch data each time form is submitted
  useEffect(() => {
    if(!isSubmittingForm) return;
    fetchAllData(setIsLoading);
  }, [data, fetchAllData, isSubmittingForm, setIsLoading])

  //conditinal display:
  // data -> display task list
  let renderedContent =
    <div className='TasksContainer'> 
      { data && data.map(task => (
        <div 
          className='Tasks'
          key={task._id}
        >
          <Task 
            task={task}
            taskID={task._id}
          />
        </div>
      )) }
    </div>
  
  if (isLoading.getAllTasks && !data) {
    renderedContent = <Loader/>
    // no data -> display empty list
  } else if (data.length === 0) {
    renderedContent = 
    <div className='TaskListEmpty'> 
      <p> { TASKS_LIST_EMPTY } </p>
    </div>
  }

  return (
    <> 
      { renderedContent }
    </>
  )
}