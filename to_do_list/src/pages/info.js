import React from 'react'

function Info() {

    return(
        <div className="info">
            <h1>Info Page</h1>
            <h2>Instructions</h2>
            <h3>Task Page</h3>
            <p>To create a new task, click on the pink, circular button with a plus sign on it, floating in the bottom right corner.</p>
            <p>After adding a description and any relevant tags, press "Add task" to add to the list of tasks to do</p>
            <h3>Completed Page</h3>
            <p>All tasks marked as completed reside here.</p>
            <p>Has the same features as the task page. Competed tasks can still be reordered, modified, and alarms set.</p>
            <h3>Task Items</h3>
            <li>
                Tasks can easily be edited by clicking on them and typing directly into the description! It automatically saves locally and to the database!
                <br />
                Tasks can be reordered by clicking and dragging one task over another.
                <br />
                The box in the top left corner of each tag can be checked to mark as completed, then the task is transferred to the completed page.
                <br />
                The Alarm icon can be clicked to add a time when the website gives a notification about the task.
                <br />
                The Trash icon deletes the task, it is permanently deleted and cannot be recovered.
                <br />
                Any tags attached to the task can be removed by clicking the '+' plus icon at the bottom left, then hovering the mouse over any tag will appear red.
                <br />
                Clicking on the tag will remove it from the gien task. Additionally, more tags can be added to the task at any time by clicking on the '+' and then clicking "add".

            </li>
            <h2>This To Do List was created by Eric Brown</h2>
        </div>
    )
}

export default Info;