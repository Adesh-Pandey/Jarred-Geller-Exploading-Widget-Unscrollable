import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './redux/store'
import { mouseDownOnTheToken, mouseUpOnColumn, addTokenInColumn, removeTokenInColumn, resetCircles, temporaryDisable } from './redux/mouseSlice'
import { motion } from "framer-motion"
import PopAudio from './audios/addedPopSound.mp3'
import RemoveIcon from '@mui/icons-material/Remove';

function ColumnComponent({ columnReverse, borderColor, alterVisibility, visibility, ShowTokenLabel, constrainsRef, order, base }: { columnReverse: boolean, borderColor: String, alterVisibility: Function, visibility: boolean, ShowTokenLabel: boolean, constrainsRef: RefObject<HTMLDivElement>, order: number, base: number }) {

    const MouseDownSource = useSelector((state: RootState) => state.allState.mouseDownSource)
    const dispatch = useDispatch()
    const ColumnCollection = useSelector((state: RootState) => state.allState.ColumnCollection.length)
    const InnerCircles = useSelector((state: RootState) => state.allState.InnerCirclesList[order])
    const audio = useRef<HTMLAudioElement>(null);
    const [stacking, setstacking] = useState(false)

    const TemporaryDisabledList = useSelector((state: RootState) => state.allState.TemporaryDiableList)


    const [InnerCircleList, setInnerCircleList] = useState([...Array(InnerCircles > 15 ? 15 : InnerCircles)])
    const [Shakeable, setShakeable] = useState(false);


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
        let Audi: any[] = [new Audio(PopAudio)]
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
                    Audi[index].play()
                }, index * 70);


                Audi.push(new Audio(PopAudio));

            }

            // Audi.play()
            setoldCOunt(InnerCircles)

        }

        setTimeout(() => {
            setShakeable((base <= InnerCircles));
            setInnerCircleList([...Array(InnerCircles > 15 ? 15 : InnerCircles)])
        }, 70);

    }, [InnerCircles,])
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
        let sendValue = ShowTokenLabel ? `x${count}` : "";
        return sendValue;
    }
    const countAndPlus = () => {

        if (columnReverse) {
            return order == 0 ? "" : "+";
        }
        return order == ColumnCollection - 1 ? "" : "+";


    }
    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className='column-individual' id={`${order}`}>
            <div className="count-tokens"
                style={{ border: (base <= InnerCircles && visibility) ? "2px solid #ea0000" : "2px solid white" }}>

                <div style={{ color: `${borderColor}` }} className='total-token-count'>{visibility ? InnerCircles : "0"}
                </div>
                <div style={{ marginTop: "4px" }}>
                    <label className="switch">
                        <input checked={visibility}
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
                border: `3px solid ${borderColor}`
            } : { border: `3px solid ${borderColor}` }} variants={variant} animate={visibility ? "open" : "closed"} id={`${order}`} className='column-individual-inner-circle-collection'>

                <motion.div
                    id={`${order}`}
                    drag={InnerCircles == 0 ? false : true}
                    onPointerDown={(e) => { e.preventDefault() }}
                    dragConstraints={constrainsRef}
                    dragElastic={0}
                    dragSnapToOrigin={true}
                    whileDrag={{ position: "absolute" }}
                    dragPropagation
                    style={{
                        //  "backgroundColor": "black", 
                        height: "200px", "overflow": "hidden"
                    }}
                    onDragEnd={
                        (event, info) => {
                            let callChanges = -1;
                            // ReactDOM.findDOMNode()
                            // console.log(info.point.x, info.point.y)
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

                            setstacking(false);
                        }
                    }
                    onDragStart={

                        (e) => { initiateDragOnDiv(e); setstacking(true) }
                    }

                    className='column-individual-inner-circle-collection-inner-div'>

                    {/* {base ** order || 1} */}
                    {InnerCircleList.map((count, idx) => {

                        return <motion.div

                            animate={stacking ? "stack" : "normal"}

                            variants={{
                                stack: {
                                    scale: Shakeable && (base <= InnerCircles) ? [0.7, 2, 1] : [0, 1],
                                    position: "relative", top: `${getPxFromTop(idx)}px`, left: `${((idx % 3) * -35 + extraRight(idx))}px`,
                                    zIndex: idx,
                                    display: idx > 17 ? "none" : "flex"
                                },
                                normal: { scale: Shakeable && (base <= InnerCircles) ? [0.7, 2, 1] : [0, 1], }
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