import React, { useState, useEffect } from 'react'
import Columns from './Columns'
import { io } from 'socket.io-client';
import { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import axios from 'axios';

function stringGen(len: number) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

const socket = io("http://localhost:3000/")


function DashboardAndColumn() {

    const InnerCirclesList = useSelector((state: RootState) => state.allState.InnerCirclesList)
    const ColumnCollection = useSelector((state: RootState) => state.allState.ColumnCollection.length)
    const TemporaryDisabledList = useSelector((state: RootState) => state.allState.TemporaryDiableList)
    const HighLightState = useSelector((state: RootState) => state.allState.HighLightList)
    const Base = useSelector((state: RootState) => state.allState.base)

    const [roomID, setroomID] = useState("");

    const [state, setstate] = useState("none");


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



    useEffect(() => {

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
        socket.on("recieveTokenCOuntLabel", (data) => {
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

    }, [socket])
    const joinRoom = () => {
        socket.emit("Join_Room", roomID);
    }

    return (
        <div>
            <div style={{ display: "grid", gridAutoFlow: "column" }}>
                <div>{roomID}</div>
                {state == "none" ? <div>
                    <button onClick={(e) => {

                        setroomID(stringGen(10));
                        setstate("teacher");
                        joinRoom();
                    }}>Create A Room</button>
                    <button onClick={() => {
                        setstate("JoinAS")
                    }}>Join A Room</button>
                </div> : ""}

                {state == "JoinAsStudent" ? <div>
                    <input type="text" value={roomID} onChange={(e) => { setroomID(e.target.value) }} placeholder='Enter The Room ID' /> <button onClick={(e) => { setstate("Student"); joinRoom() }}>Join</button>
                </div> : ""}

                {state == "JoinAS" ? <div style={{ display: "grid" }}>  <div>
                    <button className="JoinAsTeacher" onClick={(e) => { setstate("JoinAsTeacher") }}>Join As teacher</button>
                    <button className="JoinAsStudent" onClick={() => { setstate("JoinAsStudent") }}>Join As Student</button>
                </div> </div> : ""}

                {state == "JoinAsTeacher" ? <div style={{ display: "grid" }}> <div className="roomID">
                    <input value={roomID} onChange={(e) => { setroomID(e.target.value) }} type="text" placeholder='Enter Room ID' className="idInput" /> </div>  <div><input type="text" placeholder='Enter Password' /> <button onClick={() => { setstate("teacher") }}>Join</button></div> </div> : ""}
                {state == "teacher" ? <div style={{ display: "grid" }}>

                    <div><input type="checkbox" onClick={() => { setAddButton(!AddButton); socket.emit("AddButton", { AddButton: !AddButton, room: roomID }) }} checked={AddButton} name="AddButton" id="AddButton" />Add Button</div>
                    <div><input type="checkbox" onClick={() => { setToggleColumnDisable(!ToggleColumnDisable); socket.emit("ToggleColumnDisable", { ToggleColumnDisable: !ToggleColumnDisable, room: roomID }) }} checked={ToggleColumnDisable} name="ToggleColumnDisable" id="ToggleColumnDisable" />Column Disable Toggle</div>
                    <div><input type="checkbox" onClick={() => { setRemoveButton(!RemoveButton); socket.emit("RemoveButton", { RemoveButton: !RemoveButton, room: roomID }) }} checked={RemoveButton} name="RemoveButton" id="RemoveButton" />Remove Button</div>
                    <div><input type="checkbox" onClick={() => { setHighlightButton(!HighlightButton); socket.emit("HighlightButton", { HighlightButton: !HighlightButton, room: roomID }) }} checked={HighlightButton} name="HighLightButton" id="HighLightButton" />Highlight Button</div>
                    <div><input type="checkbox" onClick={() => { setTokenCountLabel(!TokenCountLabel); socket.emit("TokenCountLabel", { TokenCountLabel: !TokenCountLabel, room: roomID }) }} checked={TokenCountLabel} name="TokenCountLabel" id="TokenCountLabel" />Token Count Label</div>
                    <div><input type="checkbox" onClick={() => { setAddRemoveToken(!AddRemoveToken); socket.emit("AddRemoveToken", { AddRemoveToken: !AddRemoveToken, room: roomID }) }} checked={AddRemoveToken} name="AddRemoveToken" id="AddRemoveToken" />Add Remove Token</div>
                    <div><input type="checkbox" onClick={() => { setChangeBase(!ChangeBase); socket.emit("ChangeBase", { ChangeBase: !ChangeBase, room: roomID }) }} checked={ChangeBase} name="ChangeBase" id="ChangeBase" />Change Base</div>
                    <div><input type="checkbox" onClick={() => { setRestart(!Restart); socket.emit("Restart", { Restart: !Restart, room: roomID }) }} checked={Restart} name="Restart" id="Restart" />Restart</div>
                    <div><input type="checkbox" onClick={() => { setColumnOrderReverse(!ColumnOrderReverse); socket.emit("ColumnOrderReverse", { ColumnOrderReverse: !ColumnOrderReverse, room: roomID }) }} checked={ColumnOrderReverse} name="ColumnOrderReverse" id="ColumnOrderReverse" />Column Order Reverse</div>
                    <div><input type="checkbox" onClick={() => { setShowTokenLabelButton(!ShowTokenLabelButton); socket.emit("ShowTokenLabelButton", { ShowTokenLabelButton: !ShowTokenLabelButton, room: roomID }) }} checked={ShowTokenLabelButton} name="ShowTokenLabel" id="ShowTokenLabel" />Show Token Label</div>
                    <div><input type="checkbox" onClick={() => { setColumnTotalValue(!ColumnTotalValue); socket.emit("ColumnTotalValue", { ColumnTotalValue: !ColumnTotalValue, room: roomID }) }} checked={ColumnTotalValue} name="ColumnTotalValue" id="ColumnTotalValue" />Column Total Value</div>

                    <div><input type="checkbox" onClick={() => { setTotalValueInBaseTen(!TotalValueInBaseTen); socket.emit("TotalValueInBaseTen", { TotalValueInBaseTen: !TotalValueInBaseTen, room: roomID }) }} checked={TotalValueInBaseTen} name="TotalValueInBaseTen" id="TotalValueInBaseTen" />Total In Base 0</div>
                    <div><input type="checkbox" onClick={() => { setInnerColumnValue(!InnerColumnValue); socket.emit("InnerColumnValue", { InnerColumnValue: !InnerColumnValue, room: roomID }) }} checked={InnerColumnValue} name="InnerColumnValue" id="InnerColumnValue" />Columns's Each Token Value</div>

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
            {state == "teacher" ? <div className="saveState">  <input type="text" placeholder='Enter Room Password' /> <button
                onClick={() => {

                    axios.post("http://localhost:3000/savestate", {
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


                    // socket.emit("SAVE_STATES", {
                    //     room: roomID,
                    //     ColumnCollection: ColumnCollection,
                    //     InnerCirclesList: InnerCirclesList,
                    //     TemporaryDisabledList: TemporaryDisabledList,
                    //     HighLightState: HighLightState,
                    //     Base: Base,
                    //     AddButton: AddButton,
                    //     RemoveButton: RemoveButton,
                    //     HighlightButton: HighlightButton,
                    //     TokenCountLabel: TokenCountLabel,
                    //     ToggleColumnDisable: ToggleColumnDisable,
                    //     AddRemoveToken: AddRemoveToken,
                    //     ChangeBase: ChangeBase,
                    //     Restart: Restart,
                    //     ColumnOrderReverse: ColumnOrderReverse,
                    //     ShowTokenLabelButton: ShowTokenLabelButton,
                    //     ColumnTotalValue: ColumnTotalValue,
                    //     TotalValueInBaseTen: TotalValueInBaseTen,
                    //     InnerColumnValue: InnerColumnValue,
                    // })
                }}

            >Save</button> </div> : ""}
        </div>
    )
}

export default DashboardAndColumn