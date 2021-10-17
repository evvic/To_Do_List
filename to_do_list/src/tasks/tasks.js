import React, { useState, useEffect } from 'react'
import AddTask from './addtask';
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



function Tasks() {
    const [data, setData] = useState([{}])
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [taskItems, setTaskItems] = useState([])

    async function Loading() {
        setLoading(true)
        
        let temp = null
        temp = await GetTasks()
    
        console.log(temp)
    
        // make sure temp is not null
        if(temp !== "error") {
            setData(temp)
    
            setTaskItems(temp.map((b) => <li key={b.id}>
                <div className="task-item">
                    {b.description}
                </div>
                </li>))
        }
        else {
            setData([{"name": "error"}])
            setFailed(true)
        }
        
        setLoading(false)
    } 
    
    useEffect(() => {
        Loading()
    }, [])

    return(
        <>
        <div className="info">
            <h1>Task List</h1>
            <AddTask />
            
        </div>
        {(loading)?
        <>
            {/*List of birds is loading*/}
            <h3>loading birds...</h3>
        </>
        :
        <>
            {(!failed)?
                <>
                    {/*List of birds is done loading*/}
                    {taskItems}
                </>
                :
                <>
                    {/*List of birds FAILED loading*/}
                    <p>failed loading list</p>
                </>}
            
        </>

        }
        </>
    )
}

export default Tasks;