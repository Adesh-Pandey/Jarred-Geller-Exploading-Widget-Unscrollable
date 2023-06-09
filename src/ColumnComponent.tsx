import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './redux/store'
import { mouseDownOnTheToken, mouseUpOnColumn, addTokenInColumn, removeTokenInColumn, resetCircles, temporaryDisable, changeTokensInColumn, draggFromServer } from './redux/mouseSlice'
import { motion } from "framer-motion"
import PopAudio from './audios/addedPopSound.mp3'
import ErrorAudio from "./audios/Error-sound-effect.mp3"
import RemoveIcon from '@mui/icons-material/Remove';
import PushPinIcon from '@mui/icons-material/PushPin';


import ExplosionOfTwo from "./audios/S01_Explosion_2pts.mp3";
import ExplosionOfThree from "./audios/S01_Explosion_3pts.mp3";
import ExplosionOfFour from "./audios/S01_Explosion_4pts.mp3";
import ExplosionOfFive from "./audios/S01_Explosion_5pts.mp3";
import ExplosionOfMoreThanFive from "./audios/S01_Explosion_plus_5ps.mp3";

import ExtentionTo3 from "./audios/S04_Extension_1-3pts_01.mp3"
import ExtentionAbove3 from "./audios/S04_Extension_more_3pts_01.mp3"

import DissmissAudio from "./audios/S05_Fast_Movement_Alt_04.mp3"

interface Props {
    audioAbility: boolean,
    socket: any,
    roomID: string,
    stacking: boolean,
    _setstacking: Function,
    HighLight: boolean,
    setHighLight: Function,
    columnReverse: boolean,
    borderColor: String,
    visibility: boolean,
    ShowTokenLabel: boolean,
    constrainsRef: RefObject<HTMLDivElement>,
    order: number,
    base: number,
    PopAddAudio: string,
    PopAddAudioReverse: string,
    HighLightButton: boolean,
    TokenCountLabel: boolean,
    AddRemoveToken: boolean,
    ColumnTotalValue: boolean,
    ToggleColumnDisable: boolean,
    InnerColumnValue: boolean,
}

function ColumnComponent({ audioAbility,
    InnerColumnValue,
    roomID,
    socket,
    ToggleColumnDisable,
    HighLightButton,
    ColumnTotalValue,
    TokenCountLabel,
    AddRemoveToken,
    PopAddAudioReverse, PopAddAudio, stacking, _setstacking, HighLight,
    setHighLight,
    columnReverse,
    borderColor,
    visibility,
    ShowTokenLabel,
    constrainsRef,
    order,
    base }: Props) {


    const moreTokensRef = useRef<HTMLDivElement>(null)
    // const [HighLight, setHighLight] = useState(false);
    const EXPLOSION_AUDIO_LIST = [ExplosionOfTwo, ExplosionOfThree, ExplosionOfFour, ExplosionOfFive, ExplosionOfMoreThanFive]
    const MouseDownSource = useSelector((state: RootState) => state.allState.mouseDownSource)
    const [XandYCoordinates, setXandYCoordinates] = useState({ x: 0, y: 0 })
    const dispatch = useDispatch()
    const ColumnCollection = useSelector((state: RootState) => state.allState.ColumnCollection.length)
    const InnerCircles = useSelector((state: RootState) => state.allState.InnerCirclesList[order])
    const InnerCirclesList = useSelector((state: RootState) => state.allState.InnerCirclesList)

    const [stationaryStacking, _setstationaryStacking] = useState(false);
    // const [stacking, _setstacking] = useState(false)
    const [highLightOrWhite, sethighLightOrWhite] = useState("#95959514");

    const TemporaryDisabledList = useSelector((state: RootState) => state.allState.TemporaryDiableList)

    const [tokensWhileHover, settokensWhileHover] = useState(-1)
    const [InnerCircleList, setInnerCircleList] = useState([...Array(InnerCircles > 45 ? 45 : InnerCircles)])
    const [Shakeable, setShakeable] = useState(false);
    const [InnerCircleListDummyDiv, setInnerCircleListDummyDiv] = useState([...Array(InnerCircles > 45 ? 45 : InnerCircles)])

    const errorColor = "red";
    const [notEnoughTokens, setnotEnoughTokens] = useState(false);



    useEffect(() => {
        socket.on("CHANGE_IN_COLUMN_TOKEN_ADD", (data: any) => {
            let playPopAudio: any[] = [new Audio(PopAddAudio)];
            // audioAbility ? playPopAudio[0].play() : "";

            // audioAbility ?
            //     setTimeout(() => {
            //         let playPopAudio: any[] = [new Audio(PopAddAudioReverse)];
            //         // let playPopAudio: any[] = [new Audio(PopAddAudio)];
            //         playPopAudio[0].play();
            //     }, 100) : ""
            dispatch(changeTokensInColumn([data.ColumnIndex, data.InnerCircles]))
            // console.log(data)
        })

        socket.on("CHANGE_IN_COLUMN_TOKEN_SUBTRACT", (data: any) => {
            // let playPopAudio: any[] = [new Audio(PopAddAudioReverse)];
            // audioAbility ? playPopAudio[0].play() : "";

            // setTimeout(() => {
            //     let playPopAudio: any[] = [new Audio(PopAddAudio)];
            //     audioAbility ? playPopAudio[0].play() : "";
            // }, 100);

            dispatch(changeTokensInColumn([data.ColumnIndex, data.InnerCircles]))
            // console.log(data)
        })
        socket.on("CHANGE_IN_COLUMN_TOKEN_ZERO", (data: any) => {

            dispatch(changeTokensInColumn([data.ColumnIndex, data.InnerCircles]))
            // console.log(data)
        })

        socket.on("ToggleOnAndOff", (data: any) => {

            dispatch(temporaryDisable([data.ColumnIndex, data.value]))
            // console.log(data)
        })
        socket.on("DRAG_SUCCESSFUL", (data: any) => {

            // console.log(data);
            dispatch(draggFromServer([data.MouseDownSource, data.mouseUpOnColumn, data.MouseDownSourceTokens, data.MouseUpSourceTokens]))
        })




    }, [socket])


    const addInnerCircle = () => {

        socket.emit("changeInColumnToken", { type: "add", room: roomID, ColumnIndex: order, InnerCircles: InnerCircles + 1 })

        let playPopAudio: any[] = [new Audio(PopAddAudio)];
        audioAbility ? playPopAudio[0].play() : "";

        setTimeout(() => {
            let playPopAudio: any[] = [new Audio(PopAddAudioReverse)];
            // let playPopAudio: any[] = [new Audio(PopAddAudio)];
            audioAbility ? playPopAudio[0].play() : "";
        }, 100);

        dispatch(addTokenInColumn(order))
    }

    const removeInnerCircle = () => {
        if (InnerCircles == 0) { return }
        socket.emit("changeInColumnToken", { type: "subtract", room: roomID, ColumnIndex: order, InnerCircles: InnerCircles - 1 })
        let playPopAudio: any[] = [new Audio(PopAddAudioReverse)];
        audioAbility ? playPopAudio[0].play() : "";

        setTimeout(() => {
            let playPopAudio: any[] = [new Audio(PopAddAudio)];
            audioAbility ? playPopAudio[0].play() : "";
        }, 100);


        dispatch(removeTokenInColumn(order))
    }

    const [oldCOunt, setoldCOunt] = useState(InnerCircleList.length);
    useEffect(() => {
        // let playPopAudio: any[] = [new Audio(PopAudio)]
        if (oldCOunt !== InnerCircles) {
            let change = oldCOunt - InnerCircles;
            // if (change < 0) {
            //     change = change * -1;
            // }
            if (change > 6) {
                change = 6;
            }

            if (change > 1) {
                let playExploadingAudio: any[] = [new Audio(EXPLOSION_AUDIO_LIST[change - 2])]

                audioAbility ? playExploadingAudio[0].play() : ""
            }
            if (change < -1) {
                let playExtentionAudio: any[] = [new Audio(ExtentionTo3)];
                if (change < -3) {
                    playExtentionAudio.pop()
                    playExtentionAudio.push(new Audio(ExtentionAbove3))
                }
                audioAbility ? playExtentionAudio[0].play() : ""
            }
            setoldCOunt(InnerCircles)

        }
        // console.log(stationaryStacking)
        if (InnerCircles >= 15) {
            setstationaryStacking(true);
        } else {
            setstationaryStacking(false);
        }
        // setTimeout(() => {
        setShakeable((base <= InnerCircles) && InnerCircles <= 15);
        setInnerCircleList([...Array(InnerCircles > 45 ? 45 : InnerCircles)])
        setInnerCircleListDummyDiv([...Array(InnerCircles > 45 ? 45 : InnerCircles)])
        // }, 70);

    }, [InnerCircles])
    const initiateDragOnDiv = (e: any) => {
        e.preventDefault()
        // console.log(e)
        if (InnerCircles > 0) {
            dispatch(mouseDownOnTheToken([order, -1]));
        }


    }

    const variant = {

        open: { opacity: 1 },
        closed: { opacity: 0 },

    }
    const getPxFromTop = (index: number) => {
        const gapPx = 40;
        const nthLine = Math.floor(index / 3);


        return (index * 5 - gapPx * nthLine) + (2);
    }
    const extraRight = (index: number) => {
        if (index < 3) {
            return 7 * ((index + 1) % 3);
        }
        return 2 * (index % 3) + 7 * ((index + 1) % 3);

    }
    const resetCirclesInthisColumn = () => {
        socket.emit("changeInColumnToken", { type: "zero", room: roomID, ColumnIndex: order, InnerCircles: 0 })
        dispatch(resetCircles(order));
    }


    const whatToDisplayInsidetoken = (idx: number) => {
        if (idx != InnerCircleList.length - 1) {
            return ShowTokenLabel ? base ** order || 1 : ""
        }
        let count = 1;

        count += InnerCircles - InnerCircleList.length;
        if (count == 1) {
            return ShowTokenLabel ? base ** order || 1 : "";
        }
        return ShowTokenLabel ? base ** order || 1 : ""

    }



    const countAndPlus = () => {

        if (columnReverse) {
            return order == 0 ? "" : "+";
        }
        return order == ColumnCollection - 1 ? "" : "+";
    }

    const HighLightStyle = {
        outlineColor: "#201c1c",
        boxShadow: "9px 6px 14px -8px rgb(144, 135, 135)",
        outlineWidth: "13px",
        backgroundColor: "rgb(240 255 6 / 37%)",
        borderRadius: "6px",
    }


    const animationType = (idx: number) => {
        if (stacking) {
            if (tokensWhileHover == 0) { return "stack" }
            if (idx < tokensWhileHover) {
                return "stack";
            }
            return "noneDisplay"
        }
        return "normal";
    }

    const stationaryStackingRef = useRef(stationaryStacking);
    const setstationaryStacking = (data: boolean) => {
        stationaryStackingRef.current = data;
        _setstationaryStacking(data)
    }

    const stackingRef = useRef(stacking);

    const setstacking = (data: boolean) => {
        // console.log(data)
        stackingRef.current = data;
        _setstacking(data, order);
    }

    const onMouseMoveWhileDragging = (e: any) => {
        if (stackingRef.current) {
            setXandYCoordinates({ x: e.clientX, y: e.clientY })
            let callChanges = -1;
            const elementsHere = document.elementsFromPoint(XandYCoordinates.x, XandYCoordinates.y);
            for (let i = 0; i < elementsHere.length; i++) {
                if (elementsHere[i].classList.contains("column-individual-inner-circle-collection")) {
                    if (TemporaryDisabledList[Number(elementsHere[i]?.id)] == -1 || TemporaryDisabledList[order] == -1) {
                        // dispatch(mouseUpOnColumn(MouseDownSource))
                        if (Number(elementsHere[i].id) > order) {
                            settokensWhileHover((base ** (Number(elementsHere[i].id) - order)));

                        } else if (order == Number(elementsHere[i].id)) {
                            settokensWhileHover(0);

                        } else {
                            settokensWhileHover(1);
                        }
                        // console.log(tokensWhileHover)
                        break;
                    }
                    callChanges = i;
                    break;
                    // console.log(document.elementsFromPoint(info.point.x, info.point.y)[i])
                }
            }
            if (callChanges != -1) {
                if (elementsHere[callChanges].id) {
                    let idOftheFinalColumn = Number(elementsHere[callChanges].id)

                    if (idOftheFinalColumn >= 0) {
                        if (idOftheFinalColumn > order) {
                            settokensWhileHover((base ** (idOftheFinalColumn - order)));

                        } else if (order == idOftheFinalColumn) {
                            settokensWhileHover(0);
                        } else {
                            settokensWhileHover(1);
                        }
                        // console.log(tokensWhileHover)

                    }
                }
            }

        }
    }

    const getCurrentHoverColumn = () => {
        let callChanges = -1;
        const elementsHere = document.elementsFromPoint(XandYCoordinates.x, XandYCoordinates.y);
        for (let i = 0; i < elementsHere.length; i++) {
            if (elementsHere[i].classList.contains("column-individual-inner-circle-collection")) {
                if (TemporaryDisabledList[Number(elementsHere[i]?.id)] == -1 || TemporaryDisabledList[order] == -1) {
                    // dispatch(mouseUpOnColumn(MouseDownSource))
                    return Number(elementsHere[i].id);
                    break;
                }
                callChanges = i;
                break;
                // console.log(document.elementsFromPoint(info.point.x, info.point.y)[i])
            }
        }
        if (callChanges != -1) {
            if (elementsHere[callChanges].id) {
                let or = Number(elementsHere[callChanges].id)

                if (or >= 0)
                    // dispatch(mouseUpOnColumn(or))
                    return or
            }
        }
    }
    useEffect(() => {
        // setInnerCircleListDummyDiv(InnerCircleList)
        if (tokensWhileHover != -1 && notEnoughTokens) {
            setnotEnoughTokens(false);
        }
        if (tokensWhileHover != 0 && tokensWhileHover != -1) {
            // console.log(tokensWhileHover)

            let newList = [...InnerCircleList]
            let count = InnerCircles - InnerCircleList.length;
            if (InnerCircles != 0 && tokensWhileHover > InnerCircles && getCurrentHoverColumn() != order) {
                setnotEnoughTokens(true);
                setInnerCircleListDummyDiv([])
                let playErrorAudio: any[] = [new Audio(ErrorAudio)]
                playErrorAudio[0].volume = 0.02;
                audioAbility ? playErrorAudio[0].play() : ""

            } else {
                setInnerCircleListDummyDiv([...Array(InnerCircles > 45 ? 45 : InnerCircles)])
            }

            if (count == 0) {
                for (let index = 0; index < tokensWhileHover; index++) {
                    newList.pop()
                }
                setInnerCircleListDummyDiv(newList)
                setnotEnoughTokens(false)
            } else {
                if (tokensWhileHover - count > 0) {
                    for (let index = 0; index < tokensWhileHover - count; index++) {
                        newList.pop()
                    }
                    setInnerCircleListDummyDiv(newList)
                    // setnotEnoughTokens(false)
                }
                setnotEnoughTokens(false)
            }


        }

    }, [tokensWhileHover])


    const CommasAccordingToInternationalNumberSystem = (value: number) => {

        return value.toLocaleString()
    }
    const stackingWidthOfEachRow = () => {
        if (InnerCircles <= 15)
            return 42

        if (InnerCircles >= 45)
            return 14
        return 210 / (Math.ceil(InnerCircles / 3))
    }

    const stackingPaddingFromTop = () => {
        if (InnerCircles <= 15)
            return 1;

        if (InnerCircles >= 45)
            return 12;

        return Math.ceil((12 / 40) * InnerCircles)

    }
    const noOfRows = () => {
        return Math.ceil((InnerCircles > 45 ? 45 : InnerCircles) / 3)
    }

    const moveableComp = useRef<HTMLDivElement>(null);

    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className='column-individual' style={HighLight ? HighLightStyle : {}} id={`${order}`}>
            <div className="count-tokens"
                style={{ border: (base <= InnerCircles && visibility) ? "2px solid #ea0000" : `2px solid ${!HighLight ? "#95959514" : HighLightStyle.backgroundColor}`, backgroundColor: InnerCircles != 0 && tokensWhileHover > InnerCircles ? errorColor : "whitesmoke" }}>
                {HighLightButton ? <div onClick={() => {
                    socket.emit("HIGHLIGHT", { room: roomID, ColumnIndex: order, value: HighLight })
                    setHighLight(order);


                }}><PushPinIcon style={HighLight ? { color: "#4b4848e6" } : { color: "#aba8a8" }} /></div> : ""}
                {TokenCountLabel ? <div style={{ color: `${borderColor}` }} className='total-token-count'>{visibility ? InnerCircles : 0}
                </div> : ""}
                {ToggleColumnDisable ? <div style={{ marginTop: "4px" }}>
                    <label className="switch">
                        <input checked={visibility ? true : false}
                            onChange={() => {
                                socket.emit("ToggleOnAndOff", { room: roomID, ColumnIndex: order, value: TemporaryDisabledList[order] })
                                dispatch(temporaryDisable([order, TemporaryDisabledList[order] == -1 ? 1 : -1]));
                            }} type="checkbox" />
                        <span className="slider round"></span>
                    </label> </div> : ""}</div>
            <motion.div style={base <= InnerCircles ? {
                outlineColor: "#ea0000",
                outlineStyle: "auto",
                outlineOffset: "2px",
                border: `3px solid #95959514`,
                backgroundColor: InnerCircles != 0 && tokensWhileHover > InnerCircles ? errorColor : "whitesmoke"
            } : { backgroundColor: InnerCircles != 0 && tokensWhileHover > InnerCircles ? errorColor : "whitesmoke", border: `3px solid ${borderColor}` }} variants={variant} animate={visibility ? "open" : "closed"} id={`${order}`} className='column-individual-inner-circle-collection'>
                {tokensWhileHover == -1 || tokensWhileHover == 0 ? "" : <motion.div
                    id={`${order}`}
                    style={{
                        height: "233px", overflow: "hidden",
                        gridTemplateRows: `repeat( ${noOfRows()},${stackingWidthOfEachRow()}px)`
                    }}
                    // while
                    className='column-individual-inner-circle-collection-inner-div   '>

                    {/* {base ** order || 1} */}
                    {InnerCircleListDummyDiv.map((count, idx) => {

                        return <motion.div className='inner-circle-parent' key={idx}  ><motion.div

                            animate={{ scale: Shakeable && (base <= InnerCircleListDummyDiv.length) ? [0.7, 2, 1] : [0, 1], }}
                            variants={{
                                stack: {
                                    scale: Shakeable && (base <= InnerCircles) ? [0.7, 2, 1] : [0, 1],
                                    position: "relative", top: `${getPxFromTop(idx)}px`, left: `${((idx % 3) * -35 + extraRight(idx))}px`,
                                    zIndex: idx,
                                    display: idx > 44 ? "none" : "flex",
                                },
                                normal: { scale: Shakeable && (base <= InnerCircleListDummyDiv.length) ? [0.7, 2, 1] : [0, 1], }
                                , noneDisplay: { opacity: 0 }
                            }}
                            transition={{
                                type: 'spring', bounce: "0.5"
                                , repeat: base <= InnerCircleListDummyDiv.length && InnerCircleListDummyDiv.length <= 15 ? Infinity : 0, duration: 1
                            }}
                            key={idx}
                            style={{ backgroundColor: `${borderColor}` }}
                            className="inner-circle">
                            {(ShowTokenLabel ? base ** order || 1 : "")}
                        </motion.div></motion.div>

                    })}</motion.div>}
                <motion.div
                    id={`${order}`}
                    drag={InnerCircles == 0 ? false : true}
                    onMouseMove={onMouseMoveWhileDragging}
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    ref={moveableComp}
                    dragConstraints={constrainsRef}
                    dragElastic={0}
                    dragSnapToOrigin={true}
                    whileDrag={{ position: "absolute", height: "270px", zIndex: "100" }}
                    dragPropagation
                    style={{
                        //  "backgroundColor": "black", 
                        height: "233px", "overflow": "hidden", paddingTop: `${stackingPaddingFromTop()}px`
                        , gridTemplateRows: stacking ? "repeat( 5,42px)" : `repeat( ${noOfRows()},${stackingWidthOfEachRow()}px)`
                    }}
                    onDragEnd={
                        (event, info) => {
                            let callChanges = -1;
                            const elementsHere = document.elementsFromPoint(info.point.x, info.point.y);
                            for (let i = 0; i < elementsHere.length; i++) {
                                if (elementsHere[i].classList.contains("column-individual-inner-circle-collection")) {
                                    if (TemporaryDisabledList[Number(elementsHere[i]?.id)] == -1 || TemporaryDisabledList[order] == -1) {
                                        dispatch(mouseUpOnColumn(MouseDownSource))
                                        break;
                                    }
                                    callChanges = i;
                                    break;
                                    // console.log(document.elementsFromPoint(info.point.x, info.point.y)[i])
                                }
                            }
                            if (callChanges != -1) {
                                if (elementsHere[callChanges].id) {
                                    let or = Number(elementsHere[callChanges].id)

                                    if (or >= 0) {
                                        dispatch(mouseUpOnColumn(or))
                                        socket.emit("DRAG_SUCCESSFUL", {
                                            room: roomID,
                                            MouseDownSource: MouseDownSource,
                                            MouseDownSourceTokens: InnerCirclesList[MouseDownSource],
                                            MouseUpSourceTokens: InnerCirclesList[or],
                                            mouseUpOnColumn: or
                                        })
                                        if (or != order && InnerCircles >= (base ** (or - order))) {
                                            elementsHere[callChanges]?.classList.add(`blink-${borderColor.substring(1)}`)
                                            setTimeout(() => {
                                                elementsHere[callChanges]?.classList.remove(`blink-${borderColor.substring(1)}`)
                                            }, 500);
                                        }
                                    }
                                }
                            }

                            if (tokensWhileHover != -1 && InnerCircles != 0 && tokensWhileHover > InnerCircles) {
                                let playDismissAudio: any[] = [new Audio(DissmissAudio)]
                                audioAbility ? playDismissAudio[0].play() : ""
                            }

                            setInnerCircleList([...Array(InnerCircles > 45 ? 45 : InnerCircles)])
                            setInnerCircleListDummyDiv([...Array(InnerCircles > 45 ? 45 : InnerCircles)])

                            setstacking(false);
                            settokensWhileHover(-1);
                            setnotEnoughTokens(false);
                            moreTokensRef.current?.classList.remove("blink-red");
                        }

                    }
                    onDragStart={

                        (e, info) => {
                            initiateDragOnDiv(e);
                            setstacking(true)
                            // console.log("started")
                            moreTokensRef.current?.classList.add("blink-red");

                        }
                    }

                    className='column-individual-inner-circle-collection-inner-div'>

                    {/* {base ** order || 1} */}
                    {InnerCircleList.map((count, idx) => {

                        return <motion.div className='inner-circle-parent'

                            key={idx}
                        > <motion.div

                            animate={animationType(idx)}
                            variants={{
                                stack: {
                                    scale: Shakeable && (base <= InnerCircles) ? [0.7, 2, 1] : [0, 1],
                                    position: "relative", top: `${getPxFromTop(idx)}px`, left: `${((idx % 3) * -43 + extraRight(idx))}px`,
                                    zIndex: idx,
                                    display: idx > 14 ? "none" : "flex",
                                    // backgroundColor: 'yellow'
                                },
                                normal: { scale: Shakeable && (base <= InnerCircles) ? [0.7, 2, 1] : [0, 1], }
                                , noneDisplay: { opacity: 0 }
                            }}

                            transition={{
                                type: 'spring', bounce: "0.5"
                                , repeat: (base <= InnerCircles && InnerCircles <= 15 && !stacking) ? Infinity : 0, duration: 1
                            }}
                            style={{ backgroundColor: `${borderColor}` }}
                            className="inner-circle">
                                {idx < 44 ? (ShowTokenLabel ? base ** order || 1 : "") : whatToDisplayInsidetoken(idx)}
                            </motion.div></motion.div>
                    })}</motion.div>


                <div ref={moreTokensRef} className='some-more-token' style={{ height: "9px", minWidth: "70px" }}> {(InnerCircles - (tokensWhileHover > 0 ? tokensWhileHover : 0) - 45) <= 0 ? "" : `+ ${(InnerCircles - (tokensWhileHover > 0 ? tokensWhileHover : 0) - 45)} More`}</div>


                <div className="overlay">{InnerColumnValue ? base ** order || 1 : order == 0 ? 1 : "_"}</div>
            </motion.div>
        </div >
        {AddRemoveToken ? <div className="token-control">
            < button disabled={TemporaryDisabledList[order] == -1 ? true : false} className='end-button-left' onClick={addInnerCircle} > +</button >
            <button disabled={TemporaryDisabledList[order] == -1 ? true : false} onClick={resetCirclesInthisColumn}>0</button>
            <button disabled={TemporaryDisabledList[order] == -1 ? true : false} className='end-button-right' onClick={removeInnerCircle}><RemoveIcon /></button></div > : ""
        }

        {ColumnTotalValue ? <div className="net-value-column"><div style={{ minWidth: "70px", color: `${borderColor}` }} className="actual-total-value">{visibility ? CommasAccordingToInternationalNumberSystem((base ** order) * InnerCircles) : 0}</div> <div className="plus">{countAndPlus()}</div></div> : ""}

    </motion.div >

    )
}

export default ColumnComponent;