import React, { useState } from 'react'
import Tasks from './tasks'

function TaskPage() {

    return(
        <div className="taskpage">
            <h1>Tasks going here</h1> 
            <p>~ search bar ~</p>
            <p>~ filter ~</p>
            <Tasks />
        </div>
    )
}

export default TaskPage;