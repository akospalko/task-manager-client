import React from 'react'
import './CreateTask.css'
import { useFormDataContext } from '../contexts/FormDataContext';
import { useLoaderContext } from '../contexts/LoaderContext';
import { TASK_PLACEHOLDER } from '../helper/statusMessages';
import Loader from './Loader';
import StatusMessage from './StatusMessage';
import CharacterCount from './CharacterCount';
export default function CreateTask() {
  const operation = 'create';
  const { 
    charCount, 
    validationData, 
    createTaskEntry, 
    inputHandler, 
    submitForm, 
    isSubmittingForm,
    statusMessage,
    isDisabled, 
  } = useFormDataContext();
  const { isLoading, setIsLoading } = useLoaderContext();

  //conditional rendering
  const formContent = 
    <div className="SubmitTask"> 
      <form>
        <input
          type="text"
          onChange={ (e) => inputHandler(e, operation) }
          value={ createTaskEntry?.name || '' }
          name="name"
          placeholder={ TASK_PLACEHOLDER } 
          maxLength={ validationData?.name?.maxlength }
          disabled={ isSubmittingForm }
        /> 
        <button 
          disabled={ isDisabled.create }
          onClick={ (e) => submitForm(e, operation, null, setIsLoading) }
        > 
          <p> Add </p>
        </button>
      </form>  
      <CharacterCount 
        current={ charCount.create } 
        max={ validationData?.name?.maxlength[0] }
      />
      <StatusMessage 
        message={ statusMessage.create }
        styling={ operation } 
      />
    </div>
  let loader;
  if(isLoading.create || isLoading.delete) {
    loader = 
    <div className="SubmitTask"> 
      <Loader/> 
    </div> 
  }

  return (
    <>
      { loader }
      { formContent }
    </>
  )
}