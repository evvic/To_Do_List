import React, { useState, useEffect } from 'react'
import "./task.css"
import axios from 'axios'

async function UpdateTags(obj, url_end) {
    const url = 'http://localhost:3010/' + `${url_end}/${obj.id}`
    try {
        const response = await axios.put(url, obj)
        //console.log(response)
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
    const [editingTags, setEditingTags] = useState(false)

    const [tag, setTag] = useState("")

    useEffect(() => {
        console.log("in use effect")

        setLoading(true)

        setLocalTags(props.tags)

        if(localTags) {
            if(!props.editing) {
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
        }

    }, [localTags, props.tags])

    async function deleteTag(tag_name) {
        /// remove tag from local tags
        let temptags = await localTags
        //console.log("temptags init", temptags)
        let ind = await temptags.indexOf(tag_name)
        //console.log("ind of tag to be removed", ind, tag_name)

        if (ind !== -1) {
            temptags.splice(ind, 1);
        }

        //console.log("temptags after splice", temptags)
        props.setTags(temptags)
        setLocalTags(temptags)

        /// remove tag from ALL TAGS array
        temptags = await props.allTags
        ind = await temptags.indexOf(tag_name)

        if (ind !== -1) {
            temptags.splice(ind, 1);
        }

        props.setAllTags(temptags)

        let obj = await props.data
        obj.tags = await temptags
        obj.last_modified = new Date()

        let resp = await UpdateTags(obj, (props.completed)? "completed" : "tasks")

        if(resp !== "error") {
            console.log("Successfully removed tag.")
        }
        else {
            console.log("Error. Could not update object with removed tag.")
        }
    }

    const handleAddingTag = async () => {

        setLoading(true)

        // enter editing mode if not there already
        if(editingTags === false) {
            setEditingTags(true)
            setLoading(false)
            return
        }

        if (!tag.trim().length) {
            console.log("Tag must contain more than whitespaces!");
            setTag("")
            setEditingTags(false)
            setLoading(false)
            return
        }

        if(tag.length > 16) {
            console.log("Tag cannot be longer than 16 characters.")
            setTag("")
            setEditingTags(false)
            setLoading(false)
            return
        }

        // prevent user from adding the same tag twice
        if(localTags.find((t) => t === tag) || props.tags.find((t) => t === tag)) {
            console.log("Cannot add the same tag twice")
            setTag("")
            setEditingTags(false)
            setLoading(false)
            return
        }

        //tags
        let temptags = await props.tags
        temptags.push(tag)
        setLocalTags(temptags)
        props.setTags(localTags)

        //add tag locally to str array of allTags
        let allTempTags = await props.allTags
        allTempTags.push(tag)
        props.setAllTags(allTempTags)

        let obj = await props.data
        console.log(props.data)
        obj.tags = await temptags

        obj.last_modified = new Date()


        let resp = await UpdateTags(obj, (props.completed)? "completed" : "tasks")

        if(resp !== "error") {
            console.log("Successfully added tag to object in database.")
        }
        else {
            console.log("Error. could not update database with new tag.")
        }

        setTag("")
        setEditingTags(false)
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
            <>
                {(editingTags)?
                //editing (adding tag)
                <>
                    <form className={"inner-tag-container"}>
                        <input
                            className={"ind-tag"}
                            type="text"
                            placeholder="add new tag"
                            name="tag"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        />
                        <button className={"ind-tag-add"} disabled={loading} onClick={ handleAddingTag }>
                            {(loading)? "adding..." : (!tag.trim().length)? "exit" : "add" }
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
                </>
                :
                //NOT editing (not adding tag)
                <>
                    <div className={"inner-tag-container"}>
                        <button className={"ind-tag"} onClick={ handleAddingTag } >
                            +
                        </button>
                        {(props.editing)?
                        //task is being edited: can delete tags
                        <>
                        {[...new Set(localTags)]
                            .map((b) =>
                            <button key={b.uniqueId} className={"ind-tag-delete"} onClick={ () => deleteTag(b) }>
                                {b}
                            </button>
                        )}
                        </>
                        :
                        <>
                        {[...new Set(localTags)]
                            .map((b) =>
                            <button key={b.uniqueId} className={(b !== props.filterTag)? "ind-tag" : "ind-tag-selected"}>
                                {b}
                        </button>)}
                        </>
                    }

                    </div>

                </>
                }
            </>
        }
        </>
    )
}

export default Tags;