import React, { useState, useEffect } from 'react'
import Filter from '../components/filter'
import Search from '../components/search'
import Tasks from '../tasks/tasks'

function TaskPage() {
    const [allTags, setAllTags] = useState([])
    const [filterTag, setFilterTag] = useState(null)
    const [searchText, setSearchText] = useState(null)

    useEffect(() => {
        console.log("all tags back in task page", allTags)
    }, [allTags, filterTag])

    useEffect(() => {
        console.log("search text: ", searchText)
    }, [searchText])

    return(
        <div className="taskpage">
            <Filter allTags={allTags} setFilterTag={setFilterTag} filterTag={filterTag} />
            <h1>Tasks To Be Completed</h1>
            <Search searchText={searchText} setSearchText={setSearchText} />
            <Tasks completed={"tasks"} setAllTags={setAllTags} allTags={allTags} filterTag={filterTag}
                searchText={searchText}/>
        </div>
    )
}

export default TaskPage;