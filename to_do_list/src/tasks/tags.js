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
        return "error"
    }

}

function Tags(props) {
    const [localTags, setLocalTags] = useState(props.tags)
    const [data, setData] = useState([{}])
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [tagItems, setTagItems] = useState([])
    const [removedTask, setRemovedTask] = useState(null)
    const [editing, setEditing] = useState(false)

    const [tag, setTag] = useState("")

    useEffect(() => {
        console.log("in use effect")
        setLoading(true)

        if(!props.editing) {
            console.log("localTags", localTags)
            setTagItems(localTags.map((b) =>
                <button key={b} className={"ind-tag"}>
                    {b}
                </button>
            ))
        }
        else {
            setTagItems(localTags.map((b) =>
                <button key={b} className={"ind-tag-delete"} onClick={ () => deleteTag(b) }>
                    {b}
                </button>
            ))
        }

        setLoading(false)
    }, [localTags])

    async function deleteTag(tag_name) {
        let temptags = localTags
        let ind = temptags.indexOf(tag_name)

        if (ind !== -1) {
            temptags.splice(ind, 1);
        }

        setLocalTags(temptags)
    }

    const handleAddingTag = async () => {

        setLoading(true)

        if(!editing) {
            setEditing(true)
            setLoading(false)
            return
        }

        if(tag === "" || tag === " ") {
            setTag("")
            setEditing(false)
            setLoading(false)
            return
        }

        if(tag.length > 16) {
            setTag("")
            setEditing(false)
            setLoading(false)
            console.log("Tag cannot be longer than 16 characters.")
            return
        }

        //tags
        let temptags = await props.tags
        temptags.push(tag)

        //add tag locally to str array of allTags
        let allTempTags = await props.allTags
        allTempTags.push(tag)
        //console.log("@@allTempTags", allTempTags)
        props.setAllTags(allTempTags)
        //console.log("@@allTags", props.allTags)


        setLocalTags(temptags)
        props.setTags(localTags)

        let obj = await props.data
        console.log(props.data)
        obj.tags = await temptags

        let resp = await UpdateTags(obj, (props.completed)? "completed" : "tasks")

        if(resp !== "error") {
            console.log("Successfully added tag to object in database.")
        }
        else {
            console.log("Error. could not update database with new tag.")
        }

        setTag("")
        setEditing(false)
        setLoading(false)

        console.log(localTags)
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
                //NOT editing
                <>
                    <button className={"ind-tag"} onClick={ handleAddingTag } >
                        +
                    </button>
                    {localTags.map((b) =>
                    <button key={b} className={(b !== props.filterTag)? "ind-tag" : "ind-tag-selected"}>
                        {b}
                    </button>)}
                </>
                :
                //editing
                <>
                    <form className={"ind-tag"}>
                        <button className={"ind-tag"} disabled={loading} onClick={ handleAddingTag }>
                            {(loading)? "adding..." : "add" }
                        </button>
                        <input
                            className={"ind-tag"}
                            type="text"
                            placeholder="add new tag"
                            name="tag"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        />
                    </form>
                    {localTags

                        .map((b) =>
                        <button key={b} className={"ind-tag-delete"} onClick={ () => deleteTag(b) }>
                            {b}
                        </button>
                    )}
                </>
                }
            </div>

        }
        </>
    )
}

export default Tags;