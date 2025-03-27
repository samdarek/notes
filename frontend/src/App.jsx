import Note from './components/Note'
import './index.css'
import noteService from './services/notes'
import { useState, useEffect } from 'react'

const Notification= ({message})=>{
  if(message===null){
    return null
  }
  return <div className='error'>{message}</div>
}

const Footer = () => {  
  const footerStyle = {    
    color: 'green',    
    fontStyle: 'italic',    
    fontSize: 16  
  }  
  return (    
    <div style={footerStyle}>      
    <br />      
    <em>Note app, Department of Computer Science, University of Helsinki 2024</em>    
    </div>  
  )
}
const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  //console.log(notes);

  useEffect(()=>{
    noteService
      .getAll()
      .then(initialNotes=>{
        setNotes(initialNotes)
      })
  },[])

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random()>0.5,
    }
    noteService
      .create(noteObject)
      .then(returnedNote=>{
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (e) => {
    console.log(e.target.value)
    setNewNote(e.target.value)
  }

  const toogleImportanceOf = (id)=> {
    const note = notes.find(n=>n.id===id)
    const changedNote = {...note, important: !note.important}

    noteService
    .update(id, changedNote)
    .then(returnedNote=>{
      setNotes(notes.map(note=>note.id !== id ? note: returnedNote))
    })
    .catch(error => {      
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(()=>{
        setErrorMessage(null)
      },5000)   
      setNotes(notes.filter(n => n.id !== id))    
    })
  }


  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>        
        <button onClick={() => setShowAll(!showAll)}>          
          show {showAll ? 'important' : 'all' }        
        </button>      
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note 
            key={note.id} 
            note={note} 
            toogleImportance={()=>toogleImportanceOf(note.id)} 
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App