import React, { useState, useEffect } from 'react'
import AddTask from './addtask';
import Task from './task';
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
    const [removedTask, setRemovedTask] = useState(null)

    async function Loading() {
        setLoading(true)
        
        let temp = null
        temp = await GetTasks()
    
        console.log(temp)
    
        // make sure temp is not null
        if(temp !== "error") {
            setData(temp)

            setTaskItems(temp.map((b) =>
                <Task data={b} setRemovedTask={setRemovedTask}/>
            ))
        }
        else {
            setData([{"name": "error"}])
            setFailed(true)
        }
        
        setLoading(false)
    } 
    
    useEffect(() => {
        Loading()
    }, [removedTask])

    return(
        <>
        <div className="info">
            <h1>Task List</h1>
            <AddTask length={data.length}/>
            
        </div>
        {(loading)?
        <>
            {/*List of tasks is loading*/}
            <h3>loading tasks...</h3>
        </>
        :
        <>
            {(!failed)?
                <>
                    {/*List of tasks is done loading*/}
                    {taskItems}
                </>
                :
                <>
                    {/*List of tasks FAILED loading*/}
                    <p>failed loading list</p>
                </>}
            
        </>

        }
        </>
    )
}

export default Tasks;