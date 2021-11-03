import React, { useState, useEffect } from 'react'
import Filter from '../components/filter'
import Tasks from '../tasks/tasks'

function CompletedPage() {
    console.log("in Completed Page")
    const [allTags, setAllTags] = useState([])
    const [filterTag, setFilterTag] = useState(null)

    useEffect(() => {
        console.log("all tags back in task page", allTags)
    }, [allTags, filterTag])

    return(
        <div className="taskpage">
            {/* change so isntead of using Completed component is uses Tasks component dynamically */}
            <Filter allTags={allTags} setFilterTag={setFilterTag} filterTag={filterTag} />
            <h1>Completed Tasks</h1>
            <p>~ search bar ~</p>
            <Tasks completed={"completed"} setAllTags={setAllTags} allTags={allTags} filterTag={filterTag}/>
        </div>
    )
}

export default CompletedPage;