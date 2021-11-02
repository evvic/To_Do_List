import React, { useState, useEffect } from 'react'

function Filter(props) {
    //const [allTags, setAllTags] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        console.log("all tags back in filter page", props.allTags)
        setLoading(false)
    }, [props.allTags])

    async function handleTagSelection(tag_name) {
        console.log(tag_name)
        if(tag_name === props.filterTag) {
            props.setFilterTag(null)
        }
        else {
            props.setFilterTag(tag_name)
        }
    }

    return(
        <div className="tag-box">
            <div className="inner-tag-container">

                {[...new Set(props.allTags)]
                    .map((b) =>
                    <button key={b} className={(b !== props.filterTag)? "ind-tag" : "ind-tag-selected"}
                        onClick={() => handleTagSelection(b) }>
                        {b}
                    </button>)}
            </div>
        </div>
    )
}

export default Filter;