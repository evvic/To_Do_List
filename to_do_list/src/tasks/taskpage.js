import React, { useState, useEffect } from 'react'
import Filter from '../components/filter'
import Tasks from './tasks'

function TaskPage() {
    const [allTags, setAllTags] = useState([])
    const [filterTag, setFilterTag] = useState(null)

    useEffect(() => {
        console.log("all tags back in task page", allTags)
    }, [allTags, filterTag])

    return(
        <div className="taskpage">
            <Filter allTags={allTags} setFilterTag={setFilterTag} filterTag={filterTag} />
            <h1>Tasks going here</h1>
            <p>~ search bar ~</p>
            <Tasks setAllTags={setAllTags} allTags={allTags} filterTag={filterTag}/>
        </div>
    )
}

export default TaskPage;