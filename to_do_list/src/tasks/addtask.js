import React, { useState } from 'react'
import axios from 'axios'

async function PostTask(obj) {
    /*
    let obj = {
        "description": "finish the full stack hw assignment",
        "tags": [],
        "order": 1,
        "last_modified": "",
        "time_added": "now",
        "id": 1
      }
    */

    const url = 'http://localhost:3010/tasks'
    try {
        const response = await axios.post(url, obj)
        console.log(response)
        //return data.data
        return response
    } catch(error) {
        console.log(error)
        return error
    }
    

    
}

function AddTask() {
    const [description, setDescription] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    function ProcessTask() {
        setLoading(true)

        let today = new Date()

        let err_flag = null

        if(description === "") 
            err_flag = "error. must enter some text"
        
        if(err_flag) {
            setLoading(false)
            setError(err_flag)
            return
        }

        //edit the order
        let obj = {
            description: description,
            tags: [],
            order: 1,
            last_modified: "",
            time_added: today,
        }

        let resp = PostTask(obj)

        console.log("response ", resp)

        setLoading(false)
        setError(err_flag)
        return
    }

    return(
        <div className="addtask">
            <h1>Task List</h1>
            <form>
                <div>
                <input
                        type="text"
                        placeholder="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button disabled={loading} onClick={ () => ProcessTask() }>
                    {(loading)? "submitting..." : "submit" }
                </button>
            </form>
        </div>
    )
}

export default AddTask;