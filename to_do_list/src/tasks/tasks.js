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

async function UpdateTask(obj, url_end) {
    const url = 'http://localhost:3010/' + `${url_end}/${obj.id}`
    try {
        const response = await axios.put(url, obj)
        //console.log(response)
        return response
    }
    catch(error){
        console.log(error)
        return error
    }
}

function Tasks() {
    const [data, setData] = useState([{}])
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [taskItems, setTaskItems] = useState(0)
    const [removedTask, setRemovedTask] = useState(null)
    // reordering tasks
    const [dragId, setDragId] = useState();
    const [track, setTrack] = useState([{}])


    const handleDrag = (ev) => {
        setDragId(ev.currentTarget.id);
    };

    const handleDrop = (ev) => {
        const dragBox = data.find((task) => task.id == dragId);
        const dropBox = data.find((task) => task.id == ev.currentTarget.id);

        const dragBoxOrder = dragBox.order;
        const dropBoxOrder = dropBox.order;
        var obj1 = {}
        var obj2 = {}

        const newDataState = [...data].map((box) => {
            if (box.id == dragId) {
                box.order = dropBoxOrder;
                obj1 = box
            }
            if (box.id == ev.currentTarget.id) {
                box.order = dragBoxOrder;
                obj2 = box
            }
            return box;
        });

        console.log("newDataState", newDataState)

        setData(newDataState)
        //setTrack(newDataState)

        UpdateSwap(obj1, obj2)
    };

    async function Loading() {
        setLoading(true)

        let temp = null
        temp = await GetTasks()

        console.log(temp)

        // make sure temp is not null
        if(temp !== "error") {
            setData(temp)
            /*
            setTaskItems(temp
                .sort((a, b) => a.order - b.order)
                .map((b) =>
                <Task data={b} setRemovedTask={setRemovedTask}  completed={false}
                    handleDrag={handleDrag} handleDrop={handleDrop} />
            ))
            */
        }
        else {
            setData([{"name": "error"}])
            setFailed(true)
        }

        setLoading(false)
    }

    async function UpdateSwap(obj1, obj2) {
        setLoading(true)

        let resp = await UpdateTask(obj1, "tasks")

        if(resp !== "error") {
            console.log("updated database")
            resp = await UpdateTask(obj2, "tasks")

            if(resp !== "error") {
                console.log("Successfully saved switch to database")
                //window.location.reload()
            }
            else {
                console.log("Error. Only saved 1 swap to the db.")
            }
        }
        else {
            //setFailed(true)
            console.log("Error. Did not save switch to db.")
        }
        setLoading(false)
    }

    useEffect(() => {
        Loading()
    }, [/* removedTask */])

    useEffect(() => {
        console.log("track data", track)
        setData([...track].sort((a, b) => a.order - b.order))
    }, [track])

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

                    {[...data]
                        .sort((a, b) => a.order - b.order)
                        .map((b) =>
                        <Task data={b} setRemovedTask={setRemovedTask}  completed={false}
                            handleDrag={handleDrag} handleDrop={handleDrop} />
                    )}
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