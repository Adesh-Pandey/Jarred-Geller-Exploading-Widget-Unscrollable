import React, { useState, useEffect, useRef } from 'react'
import Columns from './Columns'
import { io } from 'socket.io-client';
import { RootState } from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { changeBase, setHighLightsFromServer, setListsFromServer } from './redux/mouseSlice';
import "./DashboardAndColumn.css"
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import ClearIcon from '@mui/icons-material/Clear';
import PopUp from './PopUp';

function stringGen(len: number) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

// const socket = io("https://synthesis-widget-backend.onrender.com")
const socket = io("http://localhost:3000/")
interface StatesOfRoom {

    RoomPassword: String,
    room: String,
    ColumnCollection: number[],
    InnerCirclesList: number[],
    TemporaryDisabledList: number[],
    HighLightState: boolean[],
    Base: number,
    AddButton: boolean,
    RemoveButton: boolean,
    HighlightButton: boolean,
    TokenCountLabel: boolean,
    ToggleColumnDisable: boolean,
    AddRemoveToken: boolean,
    ChangeBase: boolean,
    Restart: boolean,
    ColumnOrderReverse: boolean,
    ShowTokenLabelButton: boolean,
    ColumnTotalValue: boolean,
    TotalValueInBaseTen: boolean,
    InnerColumnValue: boolean

}


function DashboardAndColumn() {

    const [popUpVisible, setpopUpVisible] = useState(-1);
    const [audioAbility, setaudioAbility] = useState(true);
    const [initialState, setinitialState] = useState<StatesOfRoom[]>([]);
    const [initialStateIndex, setinitialStateIndex] = useState(0);

    const InnerCirclesList = useSelector((state: RootState) => state.allState.InnerCirclesList)
    const ColumnCollection = useSelector((state: RootState) => state.allState.ColumnCollection)
    const TemporaryDisabledList = useSelector((state: RootState) => state.allState.TemporaryDiableList)
    const HighLightState = useSelector((state: RootState) => state.allState.HighLightList)
    const Base = useSelector((state: RootState) => state.allState.base)

    const [roomID, setroomID] = useState("");

    const [state, setstate] = useState("none");
    const [roomPassword, setroomPassword] = useState("")
    const [openMenu, setopenMenu] = useState(false)
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

    const inputRef = useRef<HTMLDivElement>(null)

    const changeInitialStates = (newIndex: number) => {
        // console.log(initialState)

        dispatch(setListsFromServer([initialState[newIndex >= 0 ? newIndex : 0].TemporaryDisabledList, initialState[newIndex >= 0 ? newIndex : 0].InnerCirclesList, initialState[newIndex >= 0 ? newIndex : 0].ColumnCollection]))
        dispatch(changeBase(initialState[newIndex >= 0 ? newIndex : 0].Base))
        dispatch(setHighLightsFromServer(initialState[newIndex >= 0 ? newIndex : 0].HighLightState))
        setColumnTotalValue(initialState[newIndex >= 0 ? newIndex : 0].ColumnTotalValue)
        setRestart(initialState[newIndex >= 0 ? newIndex : 0].Restart)
        setShowTokenLabelButton(initialState[newIndex >= 0 ? newIndex : 0].ShowTokenLabelButton)
        setColumnOrderReverse(initialState[newIndex >= 0 ? newIndex : 0].ColumnOrderReverse)
        setColumnTotalValue(initialState[newIndex >= 0 ? newIndex : 0].ColumnTotalValue)
        setInnerColumnValue(initialState[newIndex >= 0 ? newIndex : 0].InnerColumnValue)
        setTotalValueInBaseTen(initialState[newIndex >= 0 ? newIndex : 0].TotalValueInBaseTen)
        setTokenCountLabel(initialState[newIndex >= 0 ? newIndex : 0].TokenCountLabel)
        setChangeBase(initialState[newIndex >= 0 ? newIndex : 0].ChangeBase)
        setAddRemoveToken(initialState[newIndex >= 0 ? newIndex : 0].AddRemoveToken)
        setToggleColumnDisable(initialState[newIndex >= 0 ? newIndex : 0].ToggleColumnDisable)
        setTokenCountLabel(initialState[newIndex >= 0 ? newIndex : 0].TokenCountLabel)
        setHighlightButton(initialState[newIndex >= 0 ? newIndex : 0].HighlightButton)
        setRemoveButton(initialState[newIndex >= 0 ? newIndex : 0].RemoveButton)
        setAddButton(initialState[newIndex >= 0 ? newIndex : 0].AddButton)


    }

    const handleMenuOpen = () => {
        setopenMenu(true);
    }
    const handleMenuClose = () => {
        setopenMenu(false);
    }

    const handleInitialStateImport = (e: any) => {


        socket.emit("changeInitialStateIndex", { room: roomID, initialStateIndex: e.target.value, initialState: initialState })
        setinitialStateIndex(e.target.value)
        changeInitialStates(e.target.value)
    }

    useEffect(() => {

        socket.on("changeInitialStateIndex", (data) => {
            setinitialStateIndex(data.initialStateIndex);

            dispatch(setListsFromServer([data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].TemporaryDisabledList, data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].InnerCirclesList, data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].ColumnCollection]))
            dispatch(changeBase(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].Base))
            dispatch(setHighLightsFromServer(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].HighLightState))
            setColumnTotalValue(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].ColumnTotalValue)
            setRestart(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].Restart)
            setShowTokenLabelButton(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].ShowTokenLabelButton)
            setColumnOrderReverse(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].ColumnOrderReverse)
            setColumnTotalValue(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].ColumnTotalValue)
            setInnerColumnValue(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].InnerColumnValue)
            setTotalValueInBaseTen(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].TotalValueInBaseTen)
            setTokenCountLabel(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].TokenCountLabel)
            setChangeBase(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].ChangeBase)
            setAddRemoveToken(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].AddRemoveToken)
            setToggleColumnDisable(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].ToggleColumnDisable)
            setTokenCountLabel(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].TokenCountLabel)
            setHighlightButton(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].HighlightButton)
            setRemoveButton(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].RemoveButton)
            setAddButton(data.initialState[data.initialStateIndex >= 0 ? data.initialStateIndex : 0].AddButton)

        })

        socket.on("NEW_STATE_CREATED", (data) => {
            setinitialState(data)
            // console.log(data);
            setroomPassword("")
        })
        socket.on("STATE_DELETED", (data) => {
            setinitialState(data);
        })
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

            setinitialState(data.results)
            setstate(data.role)
            setinitialStateIndex(data.initialStateIndex ? data.initialStateIndex : 0)
            dispatch(setListsFromServer([data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].TemporaryDisabledList, data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].InnerCirclesList, data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].ColumnCollection]))
            dispatch(changeBase(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].Base))
            dispatch(setHighLightsFromServer(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].HighLightState))
            setColumnTotalValue(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].ColumnTotalValue)
            setRestart(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].Restart)
            setShowTokenLabelButton(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].ShowTokenLabelButton)
            setColumnOrderReverse(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].ColumnOrderReverse)
            setColumnTotalValue(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].ColumnTotalValue)
            setInnerColumnValue(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].InnerColumnValue)
            setTotalValueInBaseTen(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].TotalValueInBaseTen)
            setTokenCountLabel(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].TokenCountLabel)
            setChangeBase(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].ChangeBase)
            setAddRemoveToken(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].AddRemoveToken)
            setToggleColumnDisable(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].ToggleColumnDisable)
            setTokenCountLabel(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].TokenCountLabel)
            setHighlightButton(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].HighlightButton)
            setRemoveButton(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].RemoveButton)
            setAddButton(data.results[data.initialStateIndex > 0 ? data.initialStateIndex : 0].AddButton)

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
        <div >
            {state == "teacher" || state == "Student" ? <div className='room-id'>Room ID: {" "}{roomID}</div> : ""}
            <div className='prevent-select' style={{ display: "grid", gridAutoFlow: "column" }}>

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
                {state == "teacher" || state == "Student" ? <Columns
                    audioAbility={audioAbility}
                    socket={socket} roomID={roomID} AddButton={state == "teacher" ? true : AddButton}
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
            {state == "teacher" && popUpVisible != -1 && <PopUp initialState={initialState} socket={socket} setinitialState={setinitialState} popUpVisible={popUpVisible} setpopUpVisible={setpopUpVisible} />}
            {state == "teacher" ? <div className="saveState">  <div ref={inputRef}><input value={roomPassword} onChange={(e) => { setroomPassword(e.target.value) }} type="text" placeholder='Enter Room Password' /> <button
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

                    const list = inputRef.current?.children;
                    for (let index = 0; index < 2; index++) {
                        const element = list ? list[index] : null;
                        element?.classList.add("blink-green")

                        setTimeout(() => {
                            element?.classList.remove("blink-green")
                        }, 200);

                    }

                }}

            >Save</button></div>  <div style={{
                fontWeight: "bolder",
                marginTop: "4px",
                fontFamily: "sans-serif"
            }}>
                    Audio {" "}<label className="switch">
                        <input checked={audioAbility ? true : false}
                            onChange={() => {
                                setaudioAbility(!audioAbility)
                            }} type="checkbox" />
                        <span className="slider round"></span>
                    </label> </div> </div> : ""}
            {state == "teacher" ? <div className='room-state-change'> <Select open={openMenu} onOpen={handleMenuOpen}
                onClose={handleMenuClose} MenuProps={{ onClose: handleMenuClose }} disableUnderline
                value={initialStateIndex ? String(initialStateIndex) : "0"} onChange={handleInitialStateImport}
                className='choose-conversion-list-option' name="convert-from" id="from">
                {initialState.map((x, idx) => {
                    return <MenuItem key={idx} value={`${idx}`}> <div className='password-list-item'> PASSWORD: {x.RoomPassword} {" "}  {initialStateIndex != idx ? <div onClick={(e) => {

                        e.stopPropagation();
                        setopenMenu(false);
                        setpopUpVisible(idx)
                    }}> <ClearIcon
                        style={{ color: "red", fontSize: "large", marginTop: "3px" }}></ClearIcon></div> : ""} </div></MenuItem>
                })}
            </Select> </div> : ""}

        </div>
    )
}

export default DashboardAndColumn