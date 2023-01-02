// reusable way to update some of the states (statusMessage, isDisabled, charCount) with deep copying objs. 
const updateState = (stateSetter, operation, value) => {
  stateSetter(prev => {
    const copiedState = {...prev};
    return {...copiedState, [operation] : value}
  });
}

export default updateState;