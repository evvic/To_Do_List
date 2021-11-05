import React, { useState, useEffect } from 'react'

/*
Search returns a text that wil lbe filtered in tasks
*/
function Search(props) {

    const handleClear = async () => {
        props.setSearchText("")
    }

    return(
        <div className="search-box">
            <textarea
                //oninput='this.style.height = "";this.style.height = this.scrollHeight + 3 + "px"'
                className={"search-text"}
                rows={1}
                maxLength={140}
                wrap={"soft"}
                value={props.searchText}
                placeholder={"Search tasks"}
                onChange={(e) => props.setSearchText(e.target.value)}
                disabled={false}>
                    {props.searchText}

            </textarea>
            <button onClick={ handleClear } className={"clear-btn"}>
                x
            </button>
        </div>
    )
}

export default Search;