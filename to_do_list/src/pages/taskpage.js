import React, { useState, useEffect } from 'react'
import Filter from '../components/filter'
import OrderBy from '../components/orderby'
import Search from '../components/search'
import Tasks from '../tasks/tasks'

function TaskPage() {
    const [allTags, setAllTags] = useState([])
    const [filterTag, setFilterTag] = useState(null)
    const [searchText, setSearchText] = useState(null)
    const [orderBy, setOrderBy] = useState("order")

    useEffect(() => {
        console.log("all tags back in task page", allTags)
    }, [allTags, filterTag])

    useEffect(() => {
        console.log("search text: ", searchText)
    }, [searchText])

    useEffect(() => {
        console.log("orderBy", orderBy)
    }, [orderBy])

    return(
        <div className="taskpage">
            <Filter allTags={allTags} setFilterTag={setFilterTag} filterTag={filterTag} />
            <h1>Tasks To Be Completed</h1>
            <div className="wrap-filters">
                <Search searchText={searchText} setSearchText={setSearchText} />
                <OrderBy orderBy={orderBy} setOrderBy={setOrderBy}/>
            </div>

            <Tasks completed={"tasks"} setAllTags={setAllTags} allTags={allTags} filterTag={filterTag}
                searchText={searchText} orderBy={orderBy}/>
        </div>
    )
}

export default TaskPage;