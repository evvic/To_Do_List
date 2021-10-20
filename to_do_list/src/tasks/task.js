import React, { useState, useEffect } from 'react'
import axios from 'axios'

async function GetTasks() {
    const url = 'http://localhost:3010/tasks'
    try {
        const data = await axios.get(url)
        return data.data
    }
    catch(error){
        console.log(error)
        return "error"
    }
    
}

async function deleteTask(obj) {
    console.log(obj)
    const url = 'http://localhost:3010/tasks' + `/${obj.id}`
    try {
        const response = await axios.delete(url)
        console.log(response)
        return response
    } catch(error) {

    }
}

async function addTaskCompleted(obj) {
    const url = 'http://localhost:3010/completed'

    console.log(obj)

    try {
        const response = await axios.post(url, obj)
        console.log(response)
        //return data.data
        return response
    } catch(error) {
        console.log(error)
        return error
    }
}

/*
    Have an edit button to toggle between editing the task and that changes the text to actaully
    be editable and saved as well. 
*/

function Task(props) {
    const [data, setData] = useState([{}])
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false) // init false
    const [editing, setEditing] = useState(false)

    async function Loading() {
        //setLoading(true)
        
        let temp = null
        //temp = await GetTasks()
    
        console.log(temp)
    
        // make sure temp is not null
        if(temp !== "error") {
            setData(temp)
    
        }
        else {
            setData([{"name": "error"}])
            //setFailed(true)
        }
        
        setLoading(false)
    } 

    const markCompleted = async () => {
        setLoading(true)
        setCompleted(true)
        const removedId = props.data.id
        let status = await deleteTask(props.data)
        console.log(status)
        if((await status).status == 200) {
            // successfully deleted task, now add to completed
            props.data.id = null
            status = await addTaskCompleted(props.data)

            if((await status).status == 201) {
                // successfully added task to 'completed' db array
                props.setRemovedTask(removedId)
            }
        }
        setLoading(false)
        
    }
    
    useEffect(() => {
        //Loading()
    }, [])

    return(
        <li key={props.data.id}>
            <div className="task-item">
            <label>
                <input
                type="checkbox"
                checked={completed}
                onChange={markCompleted}
                disabled={loading}
                />
                Completed
            </label>
                <button onClick={ () => setEditing(!editing) }>
                    {(editing)? "stop editing" : "edit" }
                </button>
                {props.data.description}
            </div>
        </li>
    )
}

export default Task;