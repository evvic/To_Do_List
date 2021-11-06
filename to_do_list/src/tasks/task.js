import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Tags from './tags'

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
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(props.completed) // init false
    const [liClassName, setLiClassName] = useState("task-item")

    /* state for the tasks information */
    const [description, setDescription] = useState(props.data.description)
    const [tags, setTags] = useState(props.data.tags)
    const [alarm, setAlarm] = useState((props.data.alarm)? props.data.alarm : null)

    //alarm constraints
    let tempdate = new Date().toISOString()
    tempdate = tempdate.substring(0, tempdate.length - 8)
    let curr_year = Number(tempdate.substring(0, 4))

    const [dateMin, setDateMin] = useState(tempdate)
    const [dateMax, setDateMax] = useState((++curr_year).toString() + tempdate.substring(4, tempdate.length))

    // show alarm setting
    const [showAlarm, setShowAlarm] = useState(false)
    const [alarmSet, setAlarmSet] = useState((props.data.alarm)? true : false)

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
        if(description === props.data.description) return;
        let d = new Date()

        let obj = {
            "description": description,
            "tags": tags,
            "order": props.data.order,
            "last_modified": d,
            "time_added": props.data.time_added,
            "alarm": alarm,
            "id": props.data.id
        }
        let resp = await updateTask(obj, (props.completed)? 'completed' : 'tasks')

        if((await resp).status != 200)
        // failed updating changes
            alert("couldn't save edit")

        props.setRemovedTask(props.data.id)
    }

    async function ValidateTimeSelected(sel) {
        if(sel) {
            let date_sel = await new Date(sel)
            let now = await new Date()
            console.log(date_sel, now, date_sel - now)

            if(date_sel - now <= 0) {
                console.log("Error. Set alarm in the future")
            }
            else {
                setAlarm(sel)
            }
        }
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

    async function backupAlarm(local_alarm) {
        console.log("backupAlarm", alarm, local_alarm)
        let obj = {
            "description": description,
            "tags": tags,
            "order": props.data.order,
            "last_modified": new Date(),
            "time_added": props.data.time_added,
            "alarm": local_alarm,
            "id": props.data.id
        }

        let resp = await updateTask(obj, (props.completed)? 'completed' : 'tasks')

        if((await resp).status != 200)
        // failed updating changes
            console.log("Error. Couldn't save alarm update.")
        else
            console.log("Alarm backed up.")
    }

    useEffect(() => {
        async function setUpAlarm() {
            let now = new Date()
            let later = new Date(alarm)
            setTimeout(async () => {
                await setAlarm(null);
                await setShowAlarm(false);
                await backupAlarm(null);
                await setAlarmSet(false)
                alert(props.data.description);
            }, later - now)
            await setAlarmSet(true)
            await backupAlarm(alarm)
        }

        if(alarm) {
            // set alarm to null if it is passed the current time
            if(new Date(alarm) - new Date() < 0) { setAlarm(null); setShowAlarm(false); return; }
            console.log("alarm and min n max", alarm, dateMin, dateMax)
            if(!alarmSet) {
                setUpAlarm()
            }
        }
    }, [alarm])

    return(
        <li key={props.key} id={props.data.id}
            draggable={(props.orderBy === "order")? true : false}
            onDragOver={(ev) => ev.preventDefault()}
            onDragStart={props.handleDrag}
            onDrop={props.handleDrop}
            className={liClassName}
            >
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
                    {(alarm || showAlarm)?
                    <>
                        <input className={"local-date"} value={alarm} onChange={(e) => ValidateTimeSelected(e.target.value)}
                        type="datetime-local" max={dateMax} min={dateMin} />
                        {(alarm)?
                        <></>
                        :
                        <button onClick={ () => setShowAlarm(false) } className={"delete-btn"}>
                            ✕
                        </button>
                        }

                    </>
                    :
                    <button onClick={ () => setShowAlarm(true) } className={"delete-btn"}>
                        ⏰
                    </button>
                    }


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
                        editing={false} filterTag={props.filterTag}
                        setAllTags={props.setAllTags} allTags={props.allTags}/>
                </div>
            </div>

        </li>
    )
}

export default Task;