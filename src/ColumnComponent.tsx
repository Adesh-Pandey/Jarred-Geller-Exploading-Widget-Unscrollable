import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './redux/store'
import { mouseDownOnTheToken, mouseUpOnColumn, addTokenInColumn, removeTokenInColumn, resetCircles, temporaryDisable } from './redux/mouseSlice'
import { motion } from "framer-motion"
import PopAudio from './audios/addedPopSound.mp3'
import ErrorAudio from "./audios/Error-sound-effect.mp3"
import RemoveIcon from '@mui/icons-material/Remove';
import PushPinIcon from '@mui/icons-material/PushPin';

interface Props {
    stacking: boolean,
    _setstacking: Function,
    HighLight: boolean,
    setHighLight: Function,
    columnReverse: boolean,
    borderColor: String,
    alterVisibility: Function,
    visibility: boolean,
    ShowTokenLabel: boolean,
    constrainsRef: RefObject<HTMLDivElement>,
    order: number,
    base: number
}

function ColumnComponent({ stacking, _setstacking, HighLight,
    setHighLight,
    columnReverse,
    borderColor,
    alterVisibility,
    visibility,
    ShowTokenLabel,
    constrainsRef,
    order,
    base }: Props) {
    // const [HighLight, setHighLight] = useState(false);
    const MouseDownSource = useSelector((state: RootState) => state.allState.mouseDownSource)
    const [XandYCoordinates, setXandYCoordinates] = useState({ x: 0, y: 0 })
    const dispatch = useDispatch()
    const ColumnCollection = useSelector((state: RootState) => state.allState.ColumnCollection.length)
    const InnerCircles = useSelector((state: RootState) => state.allState.InnerCirclesList[order])
    const audio = useRef<HTMLAudioElement>(null);
    // const [stacking, _setstacking] = useState(false)
    const [highLightOrWhite, sethighLightOrWhite] = useState("#95959514");

    const TemporaryDisabledList = useSelector((state: RootState) => state.allState.TemporaryDiableList)

    const [tokensWhileHover, settokensWhileHover] = useState(-1)
    const [InnerCircleList, setInnerCircleList] = useState([...Array(InnerCircles > 15 ? 15 : InnerCircles)])
    const [Shakeable, setShakeable] = useState(false);
    const [InnerCircleListDummyDiv, setInnerCircleListDummyDiv] = useState([...Array(InnerCircles > 15 ? 15 : InnerCircles)])

    const errorColor = "red";
    const [notEnoughTokens, setnotEnoughTokens] = useState(false);

    const addInnerCircle = () => {
        audio?.current?.play();
        dispatch(addTokenInColumn(order))
    }
    const removeInnerCircle = () => {
        if (InnerCircles == 0) { return }
        dispatch(removeTokenInColumn(order))
    }

    const [oldCOunt, setoldCOunt] = useState(InnerCircleList.length);
    useEffect(() => {
        let playPopAudio: any[] = [new Audio(PopAudio)]
        if (oldCOunt !== InnerCircles) {
            let change = oldCOunt - InnerCircles;
            if (change < 0) {
                change = change * -1;
            }
            if (change > 10) {
                change = 10;
            }

            for (let index = 0; index < change; index++) {

                setTimeout(() => {
                    playPopAudio[index].play()
                }, index * 70);


                playPopAudio.push(new Audio(PopAudio));

            }

            // Audi.play()
            setoldCOunt(InnerCircles)

        }

        setTimeout(() => {
            setShakeable((base <= InnerCircles));
            setInnerCircleList([...Array(InnerCircles > 15 ? 15 : InnerCircles)])
            setInnerCircleListDummyDiv([...Array(InnerCircles > 15 ? 15 : InnerCircles)])
        }, 70);

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
        let sendValue;
        if (stacking) {
            return ShowTokenLabel ? base ** order || 1 : ""
        } else {
            sendValue = `x${count}`;
        }
        return sendValue;
    }

    const whatToDisplayInsideDummyDivToken = (idx: number) => {
        if (idx != InnerCircleList.length - 1 || InnerCircles - InnerCircleList.length == 0) {
            return ShowTokenLabel ? base ** order || 1 : ""
        }

        let count = InnerCircles - InnerCircleListDummyDiv.length + 1;

        if (count == tokensWhileHover + 1) {
            return ShowTokenLabel ? base ** order || 1 : ""
        }

        if (tokensWhileHover - count < 0) {
            count = count - tokensWhileHover;
        }
        else if (tokensWhileHover > count) {
            return ShowTokenLabel ? base ** order || 1 : "";
        }

        return `x${count}`;
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
    const stackingRef = useRef(stacking);

    const setstacking = (data: boolean) => {
        // console.log(data)
        stackingRef.current = data;
        _setstacking(data, order);
    }

    const onMouseMoveWhileDragging = (e: any) => {
        if (stackingRef.current) {
            setXandYCoordinates({ x: e.clientX, y: e.clientY })
            // console.log(e.clientX)s
            // console.log(XandYCoordinates)
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

            let newList = [...InnerCircleList]
            let count = InnerCircles - InnerCircleList.length;
            if (tokensWhileHover > InnerCircles && getCurrentHoverColumn() != order) {
                setnotEnoughTokens(true);
                let playErrorAudio: any[] = [new Audio(ErrorAudio)]
                playErrorAudio[0].play()
            } else
                // setInnerCircleListDummyDiv([...Array(InnerCircles > 15 ? 15 : InnerCircles)])            
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





    const moveableComp = useRef<HTMLDivElement>(null);

    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className='column-individual' style={HighLight ? HighLightStyle : {}} id={`${order}`}>
            <div className="count-tokens"
                style={{ border: (base <= InnerCircles && visibility) ? "2px solid #ea0000" : `2px solid ${highLightOrWhite}`, backgroundColor: notEnoughTokens ? errorColor : "whitesmoke" }}>
                <div onClick={() => {
                    setHighLight(order);
                    sethighLightOrWhite(HighLight ? "#95959514" : HighLightStyle.backgroundColor)
                }}><PushPinIcon style={HighLight ? { color: "#4b4848e6" } : { color: "#aba8a8" }} /></div>
                <div style={{ color: `${borderColor}` }} className='total-token-count'>{visibility ? InnerCircles : "0"}
                </div>
                <div style={{ marginTop: "4px" }}>
                    <label className="switch">
                        <input checked={visibility ? true : false}
                            onChange={() => {
                                alterVisibility(order)
                                dispatch(temporaryDisable(order));
                            }} type="checkbox" />
                        <span className="slider round"></span>
                    </label></div></div>
            <motion.div style={base <= InnerCircles ? {
                outlineColor: "#ea0000",
                outlineStyle: "auto",
                outlineOffset: "2px",
                border: `3px solid #95959514`,
                backgroundColor: notEnoughTokens ? errorColor : "whitesmoke"
            } : { backgroundColor: notEnoughTokens ? errorColor : "whitesmoke", border: `3px solid ${borderColor}` }} variants={variant} animate={visibility ? "open" : "closed"} id={`${order}`} className='column-individual-inner-circle-collection'>
                {tokensWhileHover == -1 || tokensWhileHover == 0 ? "" : <motion.div
                    id={`${order}`}
                    style={{ height: "200px" }}
                    className='column-individual-inner-circle-collection-inner-div'>

                    {/* {base ** order || 1} */}
                    {InnerCircleListDummyDiv.map((count, idx) => {

                        return <motion.div

                            animate={{ scale: Shakeable && (base <= InnerCircleListDummyDiv.length) ? [0.7, 2, 1] : [0, 1], }}
                            variants={{
                                stack: {
                                    scale: Shakeable && (base <= InnerCircles) ? [0.7, 2, 1] : [0, 1],
                                    position: "relative", top: `${getPxFromTop(idx)}px`, left: `${((idx % 3) * -35 + extraRight(idx))}px`,
                                    zIndex: idx,
                                    display: idx > 17 ? "none" : "flex",
                                },
                                normal: { scale: Shakeable && (base <= InnerCircleListDummyDiv.length) ? [0.7, 2, 1] : [0, 1], }
                                , noneDisplay: { opacity: "0" }
                            }}
                            transition={{
                                type: 'spring', bounce: "0.5"
                                , repeat: base <= InnerCircleListDummyDiv.length ? Infinity : 0, duration: 1
                            }}
                            key={idx}
                            style={{ backgroundColor: `${borderColor}` }}
                            className="inner-circle">
                            {idx < 14 ? (ShowTokenLabel ? base ** order || 1 : "") : whatToDisplayInsideDummyDivToken(idx)}
                        </motion.div>

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
                    whileDrag={{ position: "absolute", height: "110px" }}
                    dragPropagation
                    style={{
                        //  "backgroundColor": "black", 
                        height: "200px", "overflow": "hidden"
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

                                    if (or >= 0)
                                        dispatch(mouseUpOnColumn(or))
                                }
                            }

                            setInnerCircleList([...Array(InnerCircles > 15 ? 15 : InnerCircles)])
                            setInnerCircleListDummyDiv([...Array(InnerCircles > 15 ? 15 : InnerCircles)])

                            setstacking(false);
                            settokensWhileHover(-1);
                            setnotEnoughTokens(false);
                        }
                    }
                    onDragStart={

                        (e, info) => {
                            initiateDragOnDiv(e);
                            setstacking(true)
                            // console.log("started")

                        }
                    }

                    className='column-individual-inner-circle-collection-inner-div'>

                    {/* {base ** order || 1} */}
                    {InnerCircleList.map((count, idx) => {

                        return <motion.div

                            animate={animationType(idx)}
                            variants={{
                                stack: {
                                    scale: Shakeable && (base <= InnerCircles) ? [0.7, 2, 1] : [0, 1],
                                    position: "relative", top: `${getPxFromTop(idx)}px`, left: `${((idx % 3) * -35 + extraRight(idx))}px`,
                                    zIndex: idx,
                                    display: idx > 17 ? "none" : "flex",
                                },
                                normal: { scale: Shakeable && (base <= InnerCircles) ? [0.7, 2, 1] : [0, 1], }
                                , noneDisplay: { opacity: "0" }
                            }}
                            transition={{
                                type: 'spring', bounce: "0.5"
                                , repeat: base <= InnerCircles && !stacking ? Infinity : 0, duration: 1
                            }}
                            key={idx}
                            style={{ backgroundColor: `${borderColor}` }}
                            className="inner-circle">
                            {idx < 14 ? (ShowTokenLabel ? base ** order || 1 : "") : whatToDisplayInsidetoken(idx)}
                        </motion.div>

                    })}</motion.div>
                <div className="overlay">{base ** order || 1}</div>
            </motion.div>
        </div>
        <div className="token-control">
            <button className='end-button-left' onClick={addInnerCircle}>+</button>
            <button onClick={resetCirclesInthisColumn}>0</button>
            <button className='end-button-right' onClick={removeInnerCircle}><RemoveIcon /></button></div>

        <div className="net-value-column"><div style={{ color: `${borderColor}` }} className="axtual-total-value">{visibility ? (base ** order) * InnerCircles : "0"}</div> <div className="plus">{countAndPlus()}</div></div>

    </motion.div >

    )
}

export default ColumnComponent;