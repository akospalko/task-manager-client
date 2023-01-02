import CreateTask from './components/CreateTask';
import Tasks from './components/Tasks';
import './App.css'
import FormDataLayout from './contexts/FormDataContext';
import LoaderLayout from './contexts/LoaderContext';

function App() {
  return (
    <div className="App">
      <LoaderLayout>
        <FormDataLayout>
          <div className='BackgroundOverlay'>
            <div className="Header">
              <h1> Task manager </h1>
            </div>
            <div className="CreateTask">
              <CreateTask/>
            </div>
            <Tasks/>
          </div>
        </FormDataLayout>
      </LoaderLayout>
    </div>
  )
}

export default App;