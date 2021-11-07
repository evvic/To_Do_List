import React from 'react'

function OrderBy(props) {
    return(
        <div className="order-box">
            <textarea
                className={"order-text"}
                rows={1}
                maxLength={30}
                wrap={"soft"}
                placeholder={"Search tasks"}
                value={"Order by:"}
                disabled={true} />
            <select value={props.orderBy} onChange={(e) => props.setOrderBy(e.target.value)}>
                <option value="order">Order</option>
                <option value="last_modified">Last modified</option>
            </select>
        </div>
    )
}

export default OrderBy;