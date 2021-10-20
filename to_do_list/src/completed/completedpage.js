import React, { useState } from 'react'
import Completed from './completed';

function CompletedPage() {

    return(
        <div className="taskpage">
            <h1>Tasks going here</h1> 
            <p>~ search bar ~</p>
            <p>~ filter ~</p>
            <Completed />
        </div>
    )
}

export default CompletedPage;