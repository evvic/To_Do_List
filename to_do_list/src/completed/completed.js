import React, { useState, useEffect } from 'react'
//import AddTask from './addtask';
import Task from '../tasks/task';
import axios from 'axios'

async function GetTasks() {
    const url = 'http://localhost:3010/completed'
    try {
        const data = await axios.get(url)
        return data.data
    }
    catch(error){
        console.log(error)
        return "error"
    }
    
}


function Completed() {
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
                <Task data={b} setRemovedTask={setRemovedTask} completed={true}/>
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

export default Completed;