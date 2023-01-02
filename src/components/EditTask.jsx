import React, { useEffect, useCallback } from 'react';
import './EditTask.css';
import ReturnButton from '../assets/svg_return_1.svg';
import { useFormDataContext } from '../contexts/FormDataContext';
import { useLoaderContext } from '../contexts/LoaderContext';
import { TASK_PLACEHOLDER } from '../helper/statusMessages';
import { getTask } from '../helper/axiosRequests';
import updateState from '../helper/updateState';
import Loader from './Loader';
import StatusMessage from './StatusMessage';
import CharacterCount from './CharacterCount';

export default function EditTask({ taskID, toggleModalHandler }) {
  const operation = 'update';
  const {
    updateTaskEntry,
    setUpdateTaskEntry,
    inputHandler,
    submitForm,
    isSubmittingForm,
    setActiveID,
    charCount,
    setCharCount,
    validationData,
    statusMessage,
    isDisabled,
    setStatusMessage } = useFormDataContext();
    const { isLoading, setIsLoading } = useLoaderContext();

  // fetch single task from api endpoint
  const getSingleTask = useCallback(async (taskID) => {
    const response = await getTask(taskID);
    const { data, resStatusMessage } = response;
    setUpdateTaskEntry(data);
    updateState(setStatusMessage, 'getSingleTask', resStatusMessage)
  }, [setStatusMessage, setUpdateTaskEntry])

  //set active id && get single task using id on first mount 
  useEffect(() => {
    getSingleTask(taskID);
      setActiveID(taskID);
  }, [getSingleTask, setActiveID, taskID])

  //update character count
  useEffect(() => {
    if(!updateTaskEntry || updateTaskEntry === {}) return;
    updateState(setCharCount, operation, updateTaskEntry.name.length)
  }, [setCharCount, updateTaskEntry])
  
  let loader; 
  if(isLoading.update) {
    loader =   
    <div className='EditTaskForm'>
      <Loader/>
    </div>
  }

  return (
    <div className='Background'>
      <div className='Modal'>
        <div className='Title'>
          <div
            className='ReturnButton'
            onClick={toggleModalHandler}
          >
            { <img src={ ReturnButton } alt='return button' /> || '<' }
          </div>
          <h2> Edit task </h2>
          <div className='Dummy'></div>
        </div>
        { /* loader */ }
        <div className='LoaderAndFormGroup'>
          { loader }
          {/* form  */ }
          <div className='EditTaskForm'>
            <form>
              <label className='InputGroup'>
                <span className='Label'> ID </span>
                <div className='ID'> 
                  <p> { taskID } </p>
                </div>
              </label >
              <label className='InputGroup'>
                <span className='Label'> Name </span>
                <input
                  className='InputText'
                  onChange={ (e) => inputHandler(e, operation) }
                  type="text"
                  value={ updateTaskEntry.name || '' }
                  name={ 'name' }
                  placeholder={ TASK_PLACEHOLDER }
                  maxLength={ validationData?.name?.maxlength }
                  disabled={ isSubmittingForm }
                />
              </label>
              
              <CharacterCount current={ charCount.update } max={ validationData?.name?.maxlength[0] } /> 
              
              <label className='InputGroup Checkbox'>
                <span className='Label'> Completed  </span>
                <input
                  className='InputCheckbox'
                  onChange={ (e) => inputHandler(e, operation) }
                  type="checkbox"
                  name={ "completed" }
                  checked={updateTaskEntry.completed}
                />
              </label>
            </form>
          </div>
        </div> 
        <StatusMessage 
        message={ statusMessage.update }
        styling={ operation } 
        />
        <div className='Button'>
          <button
            disabled={ isDisabled.update }
            onClick={(e) => submitForm(e, operation, toggleModalHandler, setIsLoading)}
          > 
            <p> Edit </p>
          </button>
        </div>
      </div>
    </div>
  )
}