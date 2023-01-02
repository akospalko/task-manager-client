//display task entry
import React, { useState } from 'react';
import './Task.css'
import Edit from './../assets/svg_edit_2.svg';
import Bin from './../assets/svg_bin_1.svg';
import EditTask from './EditTask';
import { deleteTask } from '../helper/axiosRequests';
import { useFormDataContext } from '../contexts/FormDataContext';
import { useLoaderContext } from '../contexts/LoaderContext';
import updateState from '../helper/updateState';

export default function Task( {task, taskID} ) {
  const { setIsSubmittingForm, activeID, setActiveID, setStatusMessage } = useFormDataContext();
  const { setIsLoading } = useLoaderContext();
  const [isModalDisplayed, setIsModalDisplayed] = useState(false); 

  //hanlders
  const toggleModalHandler = () => {
    setIsModalDisplayed(prev => !prev)
    if(activeID) {
      setActiveID('');
    }
  }
  const deleteTaskEntryHandler = async (id, toggleLoader) => {
    if(!id) return; 
    setIsSubmittingForm(true); // submit form: on
    updateState(toggleLoader, 'delete' , true);  // loader: on
    const resStatusMessage = await deleteTask(id); 
    updateState(setStatusMessage, 'delete' , resStatusMessage); // submit form: off 
    updateState(toggleLoader, 'delete' , false); // loader: off
    setIsSubmittingForm(false);
  }

  //conditional styling
  //apply different style to the completed task entry   
  let taskStyle = 'Task';
  if(task.completed) {
    taskStyle = [ 'Task', 'Completed' ].join(' ');
  }

  return (
    <>
      <div className='TaskEntry'> 
        <div className={ taskStyle } > 
          <p> { task.name } </p> 
        </div>
        <div className='TaskControl'> 
          {/* edit / delete buttons */}
          <div 
            className='ControlElem'
            onClick={toggleModalHandler}
          >
            <img src={ Edit } alt='edit button'/>
          </div>
          <div
            onClick={ async () => deleteTaskEntryHandler(task._id, setIsLoading) } 
            className='ControlElem'
          > 
            <img src={ Bin } alt='delete button'/>
          </div>
        </div>
      </div>
      {/* EditTask modal */}
      { isModalDisplayed ? 
      <EditTask 
        task= { task }
        taskID={ taskID }
        toggleModalHandler={ toggleModalHandler }
      /> : null }
    </>
  )
}