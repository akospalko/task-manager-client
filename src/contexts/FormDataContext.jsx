import React, {createContext, useContext, useState, useEffect } from 'react'
import { EMPTY, CREATE_TASK_DEFAULT, UPDATE_TASK_DEFAULT } from '../helper/statusMessages';
import updateState from '../helper/updateState';
import { patchTask, postTask, getDbValidation } from '../helper/axiosRequests';
//create context instance
const FormContext = createContext();
//export ready to use context as...
export const useFormDataContext = () => {
  return useContext(FormContext);
}
export default function FormDataLayout({ children }) {
  //form template
  const formData = {name: EMPTY, completed: false};
  //states
  const [data, setData] = useState(EMPTY);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [validationData, setValidationData] = useState({}); // mongo db validation parameters (e.g. min-maxlength)
  const [statusMessage, setStatusMessage] = useState({
    create: CREATE_TASK_DEFAULT, 
    update: UPDATE_TASK_DEFAULT, 
    delete: EMPTY,
    getDbValidation: EMPTY,
    getAllTasks: EMPTY,
    getSingleTask: EMPTY });
  const [charCount, setCharCount] = useState({create: 0, update: 0});
  const [isDisabled, setIsDisabled] = useState({create: true, update: true});
  //create task
  const [createTaskEntry, setCreateTaskEntry] = useState(formData); // container for a single task entry: either to create or update (filtered out) task.
  //update task
  const [activeID, setActiveID] = useState(EMPTY);
  const [updateTaskEntry, setUpdateTaskEntry] = useState(formData); // container for a single task entry: either to create or update (filtered out) task.

  // UE
  // request database validation data on first run
  useEffect(() => {
    return async () => {
      const res = await getDbValidation();
      const { data, resStatusMessage } = res;
      setValidationData(data);
      updateState(setStatusMessage, 'getDbValidation', resStatusMessage);
    }
  }, [])

  //form validation
  const formValidation = (operation, value) => {
    if(operation === 'create') {
      if(value.length > validationData.name.maxlength[0]) {
        updateState(setStatusMessage, operation, validationData.name.maxlength[1]);
        updateState(setIsDisabled, operation, true);
      } else if(value.length < 1) {
        updateState(setStatusMessage, operation, CREATE_TASK_DEFAULT);
        updateState(setIsDisabled, operation, true);
      } else {
        updateState(setStatusMessage, operation, EMPTY);
        updateState(setIsDisabled, operation, false);
      }
    } else if(operation === 'update') {
      if(value.length > validationData.name.maxlength[0]) {
        console.log(validationData.name.maxlength[0]);
        updateState(setStatusMessage, operation, validationData.name.maxlength[1]);
        updateState(setIsDisabled, operation, true);
      } else if(value.length < 1) {
        updateState(setStatusMessage, operation, CREATE_TASK_DEFAULT);
        updateState(setIsDisabled, operation, true);
      } else {
        updateState(setStatusMessage, operation, EMPTY);
        updateState(setIsDisabled, operation, false);
      }
    }
  }

  //form handlers
  const submitForm = async (e, operation, toggleModal=null, toggleLoader) => {
    e.preventDefault();
    setIsSubmittingForm(true);
    updateState(setIsDisabled, operation, true); // disable button on submit
    //axios requests
    if(operation === 'create') {
      updateState(toggleLoader, operation, true);
      const resStatusMessage = await postTask(activeID, createTaskEntry);
      updateState(setStatusMessage, operation, resStatusMessage);
      setCreateTaskEntry(formData);
      updateState(setCharCount, operation, 0);
      setTimeout(() => updateState(setStatusMessage, operation, CREATE_TASK_DEFAULT), 1000);
      updateState(toggleLoader, operation, false);
    } else if(operation === 'update') {
      updateState(toggleLoader, operation, true);
      const resStatusMessage = await patchTask(activeID, updateTaskEntry)
      updateState(setStatusMessage, operation, resStatusMessage);
      setUpdateTaskEntry(formData);
      updateState(setCharCount, operation, 0);
      setTimeout(() =>  {
        updateState(setStatusMessage, operation, UPDATE_TASK_DEFAULT); // default status message
        if(toggleModal) {
          toggleModal(); // close modal after form is submitted
        }
      }, 750);
      updateState(toggleLoader, operation, false);
    }
    setIsSubmittingForm(false);
  }

  // input handler for create - update task
  const inputHandler = (e, operation) => {
    const { name, value, checked } = e.target;
    let tempData = null;
    //CREATE Task
    if(operation === 'create') {
      formValidation(operation, value);
      const inputData = { ...createTaskEntry };
      if(name === 'name') {
        updateState(setCharCount, operation, value.length);
        tempData = { ...inputData, [name]: value };
      }
      if(!tempData.hasOwnProperty('completed')) { // assign 'completed' entry to the obj when handler is first run
        tempData = { ...inputData, completed: false };
      }
      setCreateTaskEntry(tempData);
    } //UPDATE Task
    else if( operation === 'update') {
      formValidation(operation, value);
      const inputData = { ...updateTaskEntry };
      if(name === 'name') {
        updateState(setCharCount, operation, value.length);
        tempData = { ...inputData, [name]: value };
      } else if(name === 'completed') {
        tempData = { ...inputData, [name]: checked };
      }
      setUpdateTaskEntry(tempData); // create - update task
    }
  }

  return (
    <FormContext.Provider
      value={{
        data,
        setData,
        isSubmittingForm,
        setIsSubmittingForm,
        submitForm,
        inputHandler,
        activeID,
        setActiveID,
        createTaskEntry,
        setCreateTaskEntry,
        updateTaskEntry,
        setUpdateTaskEntry,
        statusMessage,
        setStatusMessage,
        charCount,
        setCharCount,
        validationData,
        setValidationData,
        isDisabled,
        setIsDisabled
      }}
    >
      {children}
    </FormContext.Provider>
  )
}