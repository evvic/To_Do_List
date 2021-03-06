import React, { useState, useEffect } from 'react'
import AddTask from '../components/addtask';
import Task from './task';
import axios from 'axios'
import '../App.css'

async function GetTasks(url_end) {
    const url = 'http://localhost:3010/' + url_end
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

function CollectTags(data) {
    var tag_list = []
    for(let task of data) {
        for(let tag of task.tags) {
            tag_list.push(tag)
        }
    }
    console.log("collected tags: ", tag_list)

    return tag_list
}

function Tasks(props) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [removedTask, setRemovedTask] = useState(null)
    const [noTasks, setNoTasks] = useState(null)
    // reordering tasks
    const [dragId, setDragId] = useState();
    const [track, setTrack] = useState(null)


    const handleDrag = (ev) => {
        setDragId(ev.currentTarget.id);
    };

    const handleDrop = (ev) => {
        // do nothing if the ID's are the same
        if(dragId === ev.currentTarget.id) return;

        // else swap tasks if ID's are different
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
        temp = await GetTasks(props.completed)

        console.log("Loading() data", temp)
        setNoTasks((temp.length > 0)? false : true)

        // make sure temp is not null
        if(temp !== "error") {
            // temporarily set data
            setData(temp)

            // collect all relevant tags for tag filtering
            props.setAllTags(CollectTags(temp))

            // check each task has a unique tag, if not change task's order #
            temp = await [...temp].sort((a, b) => b.order - a.order)

            for(let i = 0; i < temp.length; i++) {
                temp[i].order = temp.length - i
            }
            setData(temp)
        }
        else {
            setData([/* {"name": "error"} */])
            setFailed(true)
        }

        setLoading(false)
    }

    async function UpdateSwap(obj1, obj2) {
        setLoading(true)

        let resp = await UpdateTask(obj1, props.completed)

        if(resp !== "error") {
            console.log("updated database")
            resp = await UpdateTask(obj2, props.completed)

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
        // only run this function if data is already loaded
        if(track !== null && data !== null) {
            console.log("track data", track, data)
            setData([...track].sort((a, b) => b.order - a.order))
            setTrack(null)
        }
    }, [track])

    useEffect(() => {
        console.log("props.filterTag", props.filterTag)

        async function checks() {
            //refreshes data
            setLoading(true)
            let tempdata = await data
            console.log("props.orderBy", props.orderBy)
            setData([{}])
            setData(tempdata)
            setLoading(false)
        }

        // only run this function if data is already loaded
        if(data !== null) {
            console.log("refreshing data")
            checks()
        }

    }, [props.filterTag, props.orderBy])

    useEffect(() => {
        // initialization!
        Loading()
    }, [removedTask])

    useEffect(() => {
        console.log("useEffect data", data)
    }, [data])

    return(
        <>

        {(loading)?
        <>
            {/*List of tasks is loading*/}
            <h3>loading tasks...</h3>
        </>
        :
        <>
        {(props.completed === "completed")?
        <></>
        :
        <div className="info">
            <AddTask length={data.length} data={data} setData={setData} setDataLoading={setLoading}/>
        </div>}

            {(data.length)?
                <div className="task-container">
                    {/*List of tasks is done loading*/}

                    {[...data]
                        .filter((d) => (props.filterTag)?
                            d.tags.find((t) => t === props.filterTag)
                            :
                            true )
                        // sort goes from highest order # to lowest OR latest
                        .sort((a, b) => (props.orderBy === "order")? b.order - a.order
                            : new Date(b.last_modified) - new Date(a.last_modified))
                        .map((b) =>
                        <Task data={b} key={b.uniqueId} setRemovedTask={setRemovedTask}
                            completed={(props.completed === "completed")? true : false}
                            handleDrag={handleDrag} handleDrop={handleDrop} filterTag={props.filterTag}
                            setAllTags={props.setAllTags} allTags={props.allTags} searchText={props.searchText}
                            orderBy={props.orderBy} />
                    )}
                </div>
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