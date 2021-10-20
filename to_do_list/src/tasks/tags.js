import React, { useState, useEffect } from 'react'
import "./task.css"

function Tags(props) {
    const [data, setData] = useState([{}])
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [tagItems, setTagItems] = useState([])
    const [removedTask, setRemovedTask] = useState(null)
    
    useEffect(() => {
        setLoading(true)
        let temp = props.tags

        setTagItems(temp.map((b) =>
                <button key={b} className={"ind-tag"}>
                    {b}
                </button>
            ))
        setLoading(false)
    }, [])

    return(
        <>
        {(loading)?
        <>
            {/*List of tasks is loading*/}
            <p>loading tags...</p>
        </>
        :
        <div className={"inner-tag-container"}>
            <button className={"ind-tag"}>
                +
            </button>
            {tagItems}
        </div>

        }
        </>
    )
}

export default Tags;