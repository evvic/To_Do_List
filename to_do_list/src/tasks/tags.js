import React, { useState, useEffect } from 'react'
import "./task.css"
import axios from 'axios'

async function UpdateTags(obj, url_end) {
    const url = 'http://localhost:3010/' + `${url_end}/${obj.id}`
    try {
        const response = await axios.put(url, obj)
        console.log(response)
        return response
    }
    catch(error){
        console.log(error)
        return error
    }
    
}

function Tags(props) {
    //var tags = props.tags
    const [data, setData] = useState([{}])
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [tagItems, setTagItems] = useState([])
    const [removedTask, setRemovedTask] = useState(null)
    const [editing, setEditing] = useState(false)

    const [tag, setTag] = useState("")
    
    useEffect(() => {
        setLoading(true)

        setTagItems(props.tags.map((b) =>
                <button key={b} className={"ind-tag"}>
                    {b}
                </button>
            ))
        setLoading(false)
    }, [props.tags])

    const handleAddingTag = async () => {

        if(!editing) {
            setEditing(true)
            return
        }

        setLoading(true)

        if(tag === "" || tag === " ") {
            setTag("")
            setLoading(false)
            return
        }
        
        //tags
        let temptags = props.tags
        temptags.push(tag)
        props.setTags(temptags)

        let obj = props.data
        console.log(props.data)
        obj.tags = temptags

        let resp = await UpdateTags(obj, (props.completed)? "completed" : "tasks")

        setEditing(false)

        setLoading(false)
    }

    return(
        <>
        {(loading)?
            <>
                {/*List of tasks is loading*/}
                <p>loading tags...</p>
            </>
        :
            <div className={"inner-tag-container"}>
                {(!editing)?
                    <button className={"ind-tag"} onClick={ handleAddingTag } >
                        +
                    </button>
                :
                    <div className={"ind-tag"}>
                        <form>
                            <button disabled={loading} onClick={ handleAddingTag }>
                                {(loading)? "adding..." : "add" }
                            </button>
                            <input
                                type="text"
                                placeholder="add new tag"
                                name="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                            />
                        </form>
                    </div>
                }
                
                {tagItems}
            </div>

        }
        </>
    )
}

export default Tags;