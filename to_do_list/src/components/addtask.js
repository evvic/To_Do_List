import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Task from '../tasks/task'


async function PostTask(obj) {
    /*
    let obj = {
        "description": "finish the full stack hw assignment",
        "tags": [],
        "order": 1,
        "last_modified": "",
        "time_added": "now",
        "alarm": null,
        "id": 1
      }
    */

    const url = 'http://localhost:3010/tasks'
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

function AddTask(props) {
    const [description, setDescription] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [opened, setOpened] = useState(false)

    const [localTags, setLocalTags] = useState([])
    const [editingTags, setEditingTags] = useState(false)
    const [tag, setTag] = useState("")

    async function ProcessTask() {
        setLoading(true)

        let today = new Date()

        let err_flag = null

        if(description === "")
            err_flag = "error. must enter some text"

        if(err_flag) {
            setLoading(false)
            setError(err_flag)
            return
        }

        //edit the order
        let obj = {
            description: description,
            tags: localTags,
            order: props.length,
            last_modified: today,
            time_added: today,
            alarm: null
        }

        let resp = await PostTask(obj)

        console.log("response ", resp)

        setLoading(false)
        setError(err_flag)
        return
    }

    const handleAddingTag = () => {

        setLoading(true)

        if (!tag.trim().length) {
            console.log("Tag must contain more than whitespaces!");
            setTag("")
            setLoading(false)
            return
        }

        if(tag.length > 16) {
            console.log("Tag cannot be longer than 16 characters.")
            setTag("")
            setLoading(false)
            return
        }

        // prevent user from adding the same tag twice
        if(localTags.find((t) => t === tag)) {
            console.log("Cannot add the same tag twice")
            setTag("")
            setLoading(false)
            return
        }

        //tags
        let temptags = localTags
        temptags.push(tag)
        setLocalTags(temptags)

        setTag("")
        setLoading(false)
    }

    async function deleteTag(tag_name) {
        /// remove tag from local tags
        let temptags = await localTags
        //console.log("temptags init", temptags)
        let ind = await temptags.indexOf(tag_name)
        //console.log("ind of tag to be removed", ind, tag_name)

        if (ind !== -1) {
            temptags.splice(ind, 1);
        }

        setLocalTags(temptags)
    }

    useEffect(() => {
        console.log(opened)
    }, [opened])

    return(
        <div className="addtask-container">
            {(!opened)?
            <div className="addtask-icon-holder" onClick={ () => setOpened(!opened)}>
                +
            </div>
            :
            <li
            className={"task-item"}
            >
            <div>
                <div className="add-task-header">
                    <button onClick={ () => ProcessTask() } className={"delete-btn"}>
                        Add task
                    </button>
                    <button onClick={ () => setOpened(!opened) } className={"delete-btn"}>
                        ✕
                    </button>
                </div>

                <textarea
                    //oninput='this.style.height = "";this.style.height = this.scrollHeight + 3 + "px"'
                    rows={4}
                    maxLength={140}
                    wrap={"soft"}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={"Enter task description here"}
                    //onBlur={ handleFinishedTyping }
                    disabled={false}>
                        {description}

                </textarea>
                <div className="tag-box">
                    <form className={"inner-tag-container"}>
                        <input
                            className={"ind-tag"}
                            type="text"
                            placeholder="add new tag"
                            name="tag"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        />
                        <button className={"ind-tag-add"} disabled={false /*loading*/} onClick={ () => setTag("") }>
                            {(loading)? "adding..." : "add" }
                        </button>
                    </form>
                    <div className={"inner-tag-container"}>
                    {[...new Set(localTags)]
                        .map((b) =>
                        <button key={b.uniqueId} className={"ind-tag-delete"} onClick={ () => deleteTag(b) }>
                            {b}
                        </button>
                    )}
                    </div>
                </div>
            </div>

        </li>
            }

            {/* <form>
                <div>
                <input
                        type="text"
                        placeholder="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button disabled={loading} onClick={ () => ProcessTask() }>
                    {(loading)? "submitting..." : "submit" }
                </button>
            </form>*/}
        </div>
    )
}

export default AddTask;