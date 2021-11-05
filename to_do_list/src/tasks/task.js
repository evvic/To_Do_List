import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Switch } from 'react-router'
import Tags from './tags'

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

async function updateTask(obj, url_end) {
    const url = 'http://localhost:3010/' + `${url_end}/${obj.id}`
    try {
        const response = await axios.put(url, obj)
        console.log(response)
        return response
    } catch(error) {
        console.log(error)
        return error
    }
}

async function deleteTask(obj, url_end) {
    console.log(obj)
    const url = 'http://localhost:3010/' + `${url_end}/${obj.id}`
    try {
        const response = await axios.delete(url)
        console.log(response)
        return response
    } catch(error) {
        console.log(error)
        return error
    }
}

async function addTaskCompleted(obj, url_end) {
    const url = 'http://localhost:3010/' + url_end

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
    const [completed, setCompleted] = useState(props.completed) // init false
    const [editing, setEditing] = useState(false)

    /* state for the tasks information */
    const [description, setDescription] = useState(props.data.description)
    const [tags, setTags] = useState(props.data.tags)

    const [liClassName, setLiClassName] = useState("task-item")

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
        setCompleted(!props.completed)
        const removedId = props.data.id
        let status = null

        if(props.completed)
            //delete task from completed list
            status = await deleteTask(props.data, 'completed')
        else
            //delete task from task list
            status = await deleteTask(props.data, 'tasks')

        console.log(status)
        if((await status).status == 200) {
            // successfully deleted task, now add to completed
            props.data.id = null
            if(props.completed)
                // add task to to-do list
                status = await addTaskCompleted(props.data, 'tasks')
            else
                //add task to completed list
                status = await addTaskCompleted(props.data, 'completed')

            if((await status).status == 201) {
                // successfully added task to 'completed' db array
                props.setRemovedTask(removedId)
            }
        }
        else {
            //failed to delete task
            alert('failed to check task off as completed')
        }
        setLoading(false)
    }

    const handleDeletion = async () => {
        let status = null
        let removedId = props.data.id

        if(props.completed)
            //delete task from completed list
            status = await deleteTask(props.data, 'completed')
        else
            //delete task from task list
            status = await deleteTask(props.data, 'tasks')

        if((await status).status == 200)
            // task was successfully deleted, update
            props.setRemovedTask(removedId)
    }

    const handleFinishedTyping = async () => {
        console.log("handleFinishedTyping", description)
        let d = new Date()

        let obj = {
            "description": description,
            "tags": tags,
            "order": props.data.order,
            "last_modified": d,
            "time_added": props.data.time_added,
            "id": props.data.id
        }
        let resp = await updateTask(obj, (props.completed)? 'completed' : 'tasks')

        if((await resp).status != 200)
        // failed updating changes
            alert("couldn't save edit")

        props.setRemovedTask(props.data.id)
    }

    useEffect(() => {
        //Loading()
        if(props.searchText === null || props.searchText === "") {
            // have this prop appear
            setLiClassName("task-item")

            //console.log("description", typeof description, description)
        }
        else {
            // check if searchText is contained in description
            // make sure description isn't null or undefined
            if(description && description.includes(props.searchText)) {
                //display task
                setLiClassName("task-item")
            }
            else {
                // hide task
                setLiClassName("task-item-hidden")
            }
        }
    }, [tags, props.searchText])

    return(
        <li key={props.key} id={props.data.id}
            draggable={(props.orderBy === "order")? true : false}
            onDragOver={(ev) => ev.preventDefault()}
            onDragStart={props.handleDrag}
            onDrop={props.handleDrop}
            className={liClassName}
            >
            {(!editing)?
            //not editing the task card
            <div>
                <div className="task-header">
                    <label>
                        <input
                        className="check-box"
                        type="checkbox"
                        checked={completed}
                        onChange={markCompleted}
                        disabled={loading}
                        />
                    </label>
                    {/*
                    <button onClick={ () => setEditing(!editing)}>
                        {(editing)? "stop editing" : "edit" }
                    </button>
                    */}

                    <button onClick={ () => console.log("set alarm here") } className={"delete-btn"}>
                        ⏰
                    </button>
                    <button onClick={ handleDeletion } className={"delete-btn"}>
                        🗑️
                    </button>
                </div>

                <textarea
                    //oninput='this.style.height = "";this.style.height = this.scrollHeight + 3 + "px"'
                    rows={4}
                    maxLength={140}
                    wrap={"soft"}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={ handleFinishedTyping }
                    disabled={false}>
                        {description}

                </textarea>
                <div className="tag-box">
                    <Tags tags={tags} setTags={setTags} data={props.data} completed={props.completed}
                        editing={editing} filterTag={props.filterTag}
                        setAllTags={props.setAllTags} allTags={props.allTags}/>
                </div>
            </div>
            :
            <div className="task-item">
                <input
                        type="text"
                        placeholder="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                <div className="tag-box">
                    <Tags tags={tags} setTags={setTags} data={props.data} completed={props.completed}
                        editing={editing} filterTag={props.filterTag}
                        setAllTags={props.setAllTags} allTags={props.allTags}/>
                </div>
            </div>}
        </li>
    )
}

export default Task;