import React, { useState, useEffect } from 'react'
import Filter from '../components/filter'
import Tasks from '../tasks/tasks'
import Search from '../components/search'
import OrderBy from '../components/orderby'

function CompletedPage() {
    console.log("in Completed Page")
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

    return(
        <div className="taskpage">
            {/* change so isntead of using Completed component is uses Tasks component dynamically */}
            <Filter allTags={allTags} setFilterTag={setFilterTag} filterTag={filterTag} />
            <h1>Completed Tasks</h1>
            <div className="wrap-filters">
                <Search searchText={searchText} setSearchText={setSearchText} />
                <OrderBy orderBy={orderBy} setOrderBy={setOrderBy}/>
            </div>
            <Tasks completed={"completed"} setAllTags={setAllTags} allTags={allTags} filterTag={filterTag}
                searchText={searchText}/>
        </div>
    )
}

export default CompletedPage;