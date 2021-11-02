import React, { useState, useEffect } from 'react'

function Filter(props) {
    //const [allTags, setAllTags] = useState([])
    const [loadingFilterTags, setLoadingFilterTags] = useState(true)
    const loadingTags = [" -- ", " -- ", " -- ", " -- ", " -- "]
    const [allSortedTags, setAllSortedTags] = useState(loadingTags)

    useEffect(() => {
        async function loading() {
            setLoadingFilterTags(true)
            //console.log("all tags back in filter page", props.allTags)
            let temptags = await props.allTags

            temptags = await temptags.sort((a, b) => a.localeCompare(b))

            setAllSortedTags(temptags)

            setLoadingFilterTags(false)
        }

        //if(props.allTags !== null)
        loading()

    }, [props.allTags, props.filterTag])

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
                {(!loadingFilterTags)?
                <>
                {[...new Set(allSortedTags)]
                    .map((b) =>
                    <button key={b} className={(b !== props.filterTag)? "ind-tag" : "ind-tag-selected"}
                        onClick={() => handleTagSelection(b) }>
                        {b}
                    </button>)}
                </>
                    :
                <>
                {[...new Set(loadingTags)]
                    .map((b) =>
                    <button key={b} className={"ind-tag"}>
                        {b}
                    </button>)}
                </>
                }


            </div>
        </div>
    )
}

export default Filter;