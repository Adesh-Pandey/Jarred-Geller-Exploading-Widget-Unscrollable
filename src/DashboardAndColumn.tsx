import React, { useState, useEffect } from 'react'
import Columns from './Columns'
import { io } from 'socket.io-client';
import { RootState } from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { changeBase, setHighLightsFromServer, setListsFromServer } from './redux/mouseSlice';
import "./DashboardAndColumn.css"
import { Select } from '@mui/material';
import { MenuItem } from '@material-ui/core';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

function stringGen(len: number) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

// const socket = io("https://synthesis-widget-backend.onrender.com")
const socket = io("http://localhost:3000/")


function DashboardAndColumn() {

    const [initialState, setinitialState] = useState([]);
    const [initialStateIndex, setinitialStateIndex] = useState("0");

    const InnerCirclesList = useSelector((state: RootState) => state.allState.InnerCirclesList)
    const ColumnCollection = useSelector((state: RootState) => state.allState.ColumnCollection)
    const TemporaryDisabledList = useSelector((state: RootState) => state.allState.TemporaryDiableList)
    const HighLightState = useSelector((state: RootState) => state.allState.HighLightList)
    const Base = useSelector((state: RootState) => state.allState.base)

    const [roomID, setroomID] = useState("");

    const [state, setstate] = useState("none");
    const [roomPassword, setroomPassword] = useState("")

    const [AddButton, setAddButton] = useState(true);
    const [RemoveButton, setRemoveButton] = useState(true)
    const [HighlightButton, setHighlightButton] = useState(true);
    const [TokenCountLabel, setTokenCountLabel] = useState(true);
    const [ToggleColumnDisable, setToggleColumnDisable] = useState(true);
    const [AddRemoveToken, setAddRemoveToken] = useState(true);
    const [ChangeBase, setChangeBase] = useState(true);
    const [Restart, setRestart] = useState(true);
    const [ColumnOrderReverse, setColumnOrderReverse] = useState(true);
    const [ShowTokenLabelButton, setShowTokenLabelButton] = useState(true);
    const [ColumnTotalValue, setColumnTotalValue] = useState(true);
    const [TotalValueInBaseTen, setTotalValueInBaseTen] = useState(true);
    const [InnerColumnValue, setInnerColumnValue] = useState(true)
    const dispatch = useDispatch();
    const [EnterRoomPassword, setEnterRoomPassword] = useState("")


    const handleInitialStateImport = () => {

    }


    useEffect(() => {

        // socket.on("connect", () => { console.log("connected") })

        socket.on("recieveColumnTotalValue", (data) => {
            setColumnTotalValue(data.ColumnTotalValue)
        })
        socket.on("recieveShowTokenLabelButton", (data) => {
            setShowTokenLabelButton(data.ShowTokenLabelButton)
        })
        socket.on("recieveColumnOrderReverse", (data) => {
            setColumnOrderReverse(data.ColumnOrderReverse)
        })
        socket.on("recieveRestart", (data) => {
            setRestart(data.Restart)
        })
        socket.on("recieveAddButton", (data) => {
            setAddButton(data.AddButton)
        })
        socket.on("recieveRemoveButton", (data) => {
            setRemoveButton(data.RemoveButton)
        })
        socket.on("recieveHighlightButton", (data) => {
            setHighlightButton(data.HighlightButton)
        })
        socket.on("recieveTokenCountLabel", (data) => {
            setTokenCountLabel(data.TokenCountLabel)
        })
        socket.on("recieveToggleColumnDisable", (data) => {
            setToggleColumnDisable(data.ToggleColumnDisable)
        })
        socket.on("recieveAddRemoveToken", (data) => {
            setAddRemoveToken(data.AddRemoveToken)
        })
        socket.on("recieveChangeBase", (data) => {
            setChangeBase(data.ChangeBase)
        })
        socket.on("recieveTokenCountLabel", (data) => {
            setTokenCountLabel(data.TokenCountLabel)
        })
        socket.on("recieveTotalValueInBaseTen", (data) => {
            setTotalValueInBaseTen(data.TotalValueInBaseTen)
        })

        socket.on("recieveInnerColumnValue", (data) => {
            setInnerColumnValue(data.InnerColumnValue)
        })

        socket.on("LOAD_THE_STATE", (data) => {

            setstate(data.role)
            dispatch(setListsFromServer([data.TemporaryDisabledList, data.InnerCirclesList, data.ColumnCollection]))
            dispatch(changeBase(data.Base))
            dispatch(setHighLightsFromServer(data.HighLightState))
            setColumnTotalValue(data.ColumnTotalValue)
            setRestart(data.Restart)
            setShowTokenLabelButton(data.ShowTokenLabelButton)
            setColumnOrderReverse(data.ColumnOrderReverse)
            setColumnTotalValue(data.ColumnTotalValue)
            setInnerColumnValue(data.InnerColumnValue)
            setTotalValueInBaseTen(data.TotalValueInBaseTen)
            setTokenCountLabel(data.TokenCountLabel)
            setChangeBase(data.ChangeBase)
            setAddRemoveToken(data.AddRemoveToken)
            setToggleColumnDisable(data.ToggleColumnDisable)
            setTokenCountLabel(data.TokenCountLabel)
            setHighlightButton(data.HighlightButton)
            setRemoveButton(data.RemoveButton)
            setAddButton(data.AddButton)

        })

        socket.on("CREATED_ROOM", (data) => {
            setstate(data.role)
        })

    }, [socket])
    const joinRoom = () => {
        // console.log(EnterRoomPassword)
        socket.emit("Join_Room", { room: roomID, RoomPassword: EnterRoomPassword, JoinAs: state });

    }

    return (
        <div className='prevent-select'>
            {state == "teacher" || state == "Student" ? <div className='room-id'>Room ID: {" "}{roomID}</div> : ""}
            <div style={{ display: "grid", gridAutoFlow: "column" }}>

                {state == "none" ? <div className='create-room-page'>
                    <button onClick={(e) => {
                        // setroomID("7f7ix1izld");
                        setstate("CreateRoom");
                        // joinRoom();
                    }}>Create a Room</button>
                    <button onClick={() => {
                        setstate("JoinAS")
                    }}>Join a Room</button>
                </div> : ""}

                {state == "JoinAsStudent" ? <div className='join-as-student'>
                    <input type="text" value={roomID} onChange={(e) => { setroomID(e.target.value) }} placeholder='Enter The Room ID' /> <button onClick={(e) => { joinRoom() }}>Join</button>
                </div> : ""}

                {state == "CreateRoom" ? <div className='join-as-student'>
                    <input type="text" value={roomID} onChange={(e) => { setroomID(e.target.value) }} placeholder='Enter The Room ID' /> <button onClick={(e) => { joinRoom() }}>Create</button>
                    <button onClick={() => { setroomID(stringGen(15)) }}>Random Room ID</button></div> : ""}

                {state == "JoinAS" ? <div >  <div className='join-as-screen'>
                    <button className="JoinAsTeacher" onClick={(e) => { setstate("JoinAsTeacher") }}>Join As teacher</button>
                    <button className="JoinAsStudent" onClick={() => { setstate("JoinAsStudent") }}>Join As Student</button>
                </div> </div> : ""}

                {state == "JoinAsTeacher" ? <div className='outer-div-join-as-teacher'> <div className='inner-div-join-as-teacher'> <div className="input-collection-join-as-teacher">
                    <input value={roomID} onChange={(e) => { setroomID(e.target.value) }} type="text" placeholder='Enter Room ID' className="idInput" /> <input type="text" value={EnterRoomPassword} onChange={(e) => { setEnterRoomPassword(e.target.value) }} placeholder='Enter Password' /></div>  <div className='btns-join-as-teacher'> <button onClick={() => {
                        joinRoom()

                    }}>Join</button></div></div> </div> : ""}
                {state == "teacher" ? <div style={{ display: "grid" }}>

                    <div className='access-control-div'><input type="checkbox" onClick={() => { setAddButton(!AddButton); socket.emit("AddButton", { AddButton: !AddButton, room: roomID }) }} checked={AddButton} name="AddButton" id="AddButton" />Add Button</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setToggleColumnDisable(!ToggleColumnDisable); socket.emit("ToggleColumnDisable", { ToggleColumnDisable: !ToggleColumnDisable, room: roomID }) }} checked={ToggleColumnDisable} name="ToggleColumnDisable" id="ToggleColumnDisable" />Column Disable Toggle</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setRemoveButton(!RemoveButton); socket.emit("RemoveButton", { RemoveButton: !RemoveButton, room: roomID }) }} checked={RemoveButton} name="RemoveButton" id="RemoveButton" />Remove Button</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setHighlightButton(!HighlightButton); socket.emit("HighlightButton", { HighlightButton: !HighlightButton, room: roomID }) }} checked={HighlightButton} name="HighLightButton" id="HighLightButton" />Highlight Button</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setTokenCountLabel(!TokenCountLabel); socket.emit("TokenCountLabel", { TokenCountLabel: !TokenCountLabel, room: roomID }) }} checked={TokenCountLabel} name="TokenCountLabel" id="TokenCountLabel" />Token Count Label</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setAddRemoveToken(!AddRemoveToken); socket.emit("AddRemoveToken", { AddRemoveToken: !AddRemoveToken, room: roomID }) }} checked={AddRemoveToken} name="AddRemoveToken" id="AddRemoveToken" />Add Remove Token</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setChangeBase(!ChangeBase); socket.emit("ChangeBase", { ChangeBase: !ChangeBase, room: roomID }) }} checked={ChangeBase} name="ChangeBase" id="ChangeBase" />Change Base</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setRestart(!Restart); socket.emit("Restart", { Restart: !Restart, room: roomID }) }} checked={Restart} name="Restart" id="Restart" />Restart</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setColumnOrderReverse(!ColumnOrderReverse); socket.emit("ColumnOrderReverse", { ColumnOrderReverse: !ColumnOrderReverse, room: roomID }) }} checked={ColumnOrderReverse} name="ColumnOrderReverse" id="ColumnOrderReverse" />Column Order Reverse</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setShowTokenLabelButton(!ShowTokenLabelButton); socket.emit("ShowTokenLabelButton", { ShowTokenLabelButton: !ShowTokenLabelButton, room: roomID }) }} checked={ShowTokenLabelButton} name="ShowTokenLabel" id="ShowTokenLabel" />Show Token Label</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setColumnTotalValue(!ColumnTotalValue); socket.emit("ColumnTotalValue", { ColumnTotalValue: !ColumnTotalValue, room: roomID }) }} checked={ColumnTotalValue} name="ColumnTotalValue" id="ColumnTotalValue" />Column Total Value</div>

                    <div className='access-control-div'><input type="checkbox" onClick={() => { setTotalValueInBaseTen(!TotalValueInBaseTen); socket.emit("TotalValueInBaseTen", { TotalValueInBaseTen: !TotalValueInBaseTen, room: roomID }) }} checked={TotalValueInBaseTen} name="TotalValueInBaseTen" id="TotalValueInBaseTen" />Total In Base 0</div>
                    <div className='access-control-div'><input type="checkbox" onClick={() => { setInnerColumnValue(!InnerColumnValue); socket.emit("InnerColumnValue", { InnerColumnValue: !InnerColumnValue, room: roomID }) }} checked={InnerColumnValue} name="InnerColumnValue" id="InnerColumnValue" />Columns's Each Token Value</div>

                </div> : ""}
                {state == "teacher" || state == "Student" ? <Columns socket={socket} roomID={roomID} AddButton={state == "teacher" ? true : AddButton}
                    InnerColumnValue={state == "teacher" ? true : InnerColumnValue}
                    ToggleColumnDisable={state == "teacher" ? true : ToggleColumnDisable}
                    TotalValueInBaseTen={state == "teacher" ? true : TotalValueInBaseTen}
                    RemoveButton={state == "teacher" ? true : RemoveButton}
                    HighLightButton={state == "teacher" ? true : HighlightButton}
                    TokenCountLabel={state == "teacher" ? true : TokenCountLabel}
                    AddRemoveToken={state == "teacher" ? true : AddRemoveToken}
                    ChangeBase={state == "teacher" ? true : ChangeBase}
                    Restart={state == "teacher" ? true : Restart}
                    ColumnOrderReverse={state == "teacher" ? true : ColumnOrderReverse}
                    ShowTokenLabelButton={state == "teacher" ? true : ShowTokenLabelButton}
                    ColumnTotalValue={state == "teacher" ? true : ColumnTotalValue} /> : ""}

            </div>
            {state == "teacher" ? <div className="saveState">  <input value={roomPassword} onChange={(e) => { setroomPassword(e.target.value) }} type="text" placeholder='Enter Room Password' /> <button
                onClick={() => {

                    socket.emit("SAVE_STATES", {
                        RoomPassword: roomPassword,
                        room: roomID,
                        ColumnCollection: ColumnCollection,
                        InnerCirclesList: InnerCirclesList,
                        TemporaryDisabledList: TemporaryDisabledList,
                        HighLightState: HighLightState,
                        Base: Base,
                        AddButton: AddButton,
                        RemoveButton: RemoveButton,
                        HighlightButton: HighlightButton,
                        TokenCountLabel: TokenCountLabel,
                        ToggleColumnDisable: ToggleColumnDisable,
                        AddRemoveToken: AddRemoveToken,
                        ChangeBase: ChangeBase,
                        Restart: Restart,
                        ColumnOrderReverse: ColumnOrderReverse,
                        ShowTokenLabelButton: ShowTokenLabelButton,
                        ColumnTotalValue: ColumnTotalValue,
                        TotalValueInBaseTen: TotalValueInBaseTen,
                        InnerColumnValue: InnerColumnValue,
                    })
                }}

            >Save</button> </div> : ""}

            {/* <Select disableUnderline value={initialStateIndex} onChange={handleInitialStateImport} className='choose-conversion-list-option' name="convert-from" id="from">
                {initialState.map((x, idx) => { return <MenuItem value={`${idx}`}>  {idx} </MenuItem> })}
            </Select> */}
        </div>
    )
}

export default DashboardAndColumn