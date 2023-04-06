import React, { useState } from 'react'
import "./popup.css"
interface popup {
    popUpVisible: number,
    setpopUpVisible: Function,
    socket: any,
    initialState: any,
    setinitialState: Function
}

function PopUp({ socket, initialState, setinitialState, popUpVisible, setpopUpVisible }: popup) {

    return (
        <>
            <div className='popup-wrapper'>
                <div className='popup-container' onClick={() => { }}>
                    <div className='warning-delete-state'>
                        Sure You Want To Delete?
                    </div>
                    <div className='btn-warning'>
                        <button className='yes-delete' onClick={() => {
                            let newList = [...initialState]
                            const removedItem = newList.splice(popUpVisible, 1);
                            // setinitialState(newList)
                            socket.emit("REMOVED_STATE", removedItem[0]);

                            setpopUpVisible(-1);
                        }}> Yes</button>
                        <button className='no-delete' onClick={() => { setpopUpVisible(-1) }}>No</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PopUp