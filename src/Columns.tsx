import { useState, useEffect, useRef } from 'react'
import ColumnComponent from './ColumnComponent';
import "./column.css"
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useSelector, useDispatch } from 'react-redux'
import AddIcon from '@mui/icons-material/Add';

import RemoveIcon from '@mui/icons-material/Remove';

import { addColumn, changeBase, clearAllStateInTheReduxState, removeColumn } from './redux/mouseSlice'
import type { RootState } from './redux/store'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PopAddAudio1 from "./audios/S02_Pop_01.mp3";
import PopAddAudio2 from "./audios/S02_Pop_02.mp3";
import PopAddAudio3 from "./audios/S02_Pop_03.mp3";
import PopAddAudio4 from "./audios/S02_Pop_04.mp3";
import PopAddAudio5 from "./audios/S02_Pop_05.mp3";

import PopAddAudioReverse1 from "./audios/S08_Pop_Reverse_01.mp3";
import PopAddAudioReverse2 from "./audios/S08_Pop_Reverse_02.mp3";
import PopAddAudioReverse3 from "./audios/S08_Pop_Reverse_03.mp3";
import PopAddAudioReverse4 from "./audios/S08_Pop_Reverse_04.mp3";
import PopAddAudioReverse5 from "./audios/S08_Pop_Reverse_04.mp3";


interface Props {
    AddButton: boolean,
    RemoveButton: boolean,
    HighLightButton: boolean,
    TokenCountLabel: boolean,
    AddRemoveToken: boolean,
    ChangeBase: boolean,
    Restart: boolean,
    ColumnOrderReverse: boolean,
    ShowTokenLabelButton: boolean,
    ColumnTotalValue: boolean,
}


function Columns({
    AddButton,
    RemoveButton,
    HighLightButton,
    TokenCountLabel,
    AddRemoveToken,
    ChangeBase,
    Restart,
    ColumnOrderReverse,
    ShowTokenLabelButton,
    ColumnTotalValue,
}: Props) {
    const POP_ADD_AUDIO_LIST = [PopAddAudio1, PopAddAudio2, PopAddAudio3, PopAddAudio4, PopAddAudio5, PopAddAudio5];
    const POP_ADD_AUDIO_REVERSE_LIST = [PopAddAudioReverse1, PopAddAudioReverse2, PopAddAudioReverse3, PopAddAudioReverse4, PopAddAudioReverse4, PopAddAudioReverse4];
    const [columnReverse, setcolumnReverse] = useState(true);
    const [colorList, setcolorList] = useState(["#D2ABFE", "#ED74B8", "#FF8B1A", "#3CA776", "#107FF0"])
    const Base = useSelector((state: RootState) => state.allState.base)
    const [Visibility, setVisibility] = useState(true)
    const containerDiv = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch()
    const ColumnCollection = useSelector((state: RootState) => state.allState.ColumnCollection)
    const [selected, setselected] = useState("2")
    const [ShowTokenLabel, setShowTokenLabel] = useState(true)
    const TemporaryDisabledList = useSelector((state: RootState) => state.allState.TemporaryDiableList)

    const [visibilityList, setvisibilityList] = useState([...Array(ColumnCollection.length)].map(x => true))

    const [stacking, setstacking] = useState([...Array(ColumnCollection.length).map(x => false)]);
    const [HighLightList, setHighLightList] = useState([...Array(ColumnCollection.length)].map(x => false));

    const handleSelectChange = (event: any) => {
        dispatch(changeBase(Number(event.target.value))); setselected(event.target.value);
    }
    const totalValue = () => {
        let finalVal = 0;
        for (let index = 0; index < TemporaryDisabledList.length; index++) {
            finalVal += TemporaryDisabledList[index] != -1 ? TemporaryDisabledList[index] * Base ** (index) : 0;

        }
        return finalVal.toLocaleString();
    }
    const alterVisibility = (order: number) => {
        let newList = [...visibilityList]
        newList[order] = !newList[order];
        setvisibilityList([...newList]);
    }

    const ClearAllState = () => {
        dispatch(clearAllStateInTheReduxState());
        setvisibilityList([...[...Array(ColumnCollection.length)].map(x => true), true]);
        setHighLightList([...Array(ColumnCollection.length)].map(x => false));
        setstacking([...Array(ColumnCollection.length)].map(x => false));
        setShowTokenLabel(true);
        setselected("2");
        setcolumnReverse(true);
    }

    useEffect(() => {

        if (visibilityList.length != 0) {
            if (ColumnCollection.length > visibilityList.length) {
                setvisibilityList([...visibilityList, true]);
                setHighLightList([...HighLightList, false]);
                setstacking([...stacking, false]);
            } else if (ColumnCollection.length < visibilityList.length) {
                let newList = [[...visibilityList], [...stacking]];
                newList[0].pop();
                setvisibilityList(newList[0]);
                newList[1].pop()
                setstacking(newList[1])
                let newHighLightList = [...HighLightList];
                newHighLightList.pop()
                setHighLightList(newHighLightList)


            }
        }
    }, [ColumnCollection])

    const setHighLight = (idx: number) => {
        let newHighLight = [...HighLightList];
        newHighLight[idx] = !newHighLight[idx];
        setHighLightList(newHighLight)
    }
    const setStackingData = (data: boolean, idx: number) => {
        let newStackList = [...stacking];
        newStackList[idx] = !newStackList[idx];
        setstacking(newStackList)
    }

    return (<div className='main-app-wrapper-container'>
        <div className='show-label-restart' style={{ fontFamily: "cursive" }}>{ShowTokenLabelButton ? <div style={{ cursor: "default" }}>
            <input className='show-tokens' type="checkbox" checked={ShowTokenLabel} value={ShowTokenLabel ? 1 : 0} onChange={() => {
                setShowTokenLabel(!ShowTokenLabel);
            }} /> Show Token Label</div> : ""} {Restart ? <button type="button" onClick={() => { ClearAllState() }}>Restart</button> : ""}</div>

        <div className="choose-conversion">
            <div className="borderless-div">
                {ChangeBase ? <div className="choose-conversion-list">

                    <Select disableUnderline value={selected} onChange={handleSelectChange} className='choose-conversion-list-option' name="convert-from" id="from">
                        <MenuItem value="2"> 1 <ArrowRightAltIcon className
                            ='reverse-arrow' /> 2 </MenuItem>
                        <MenuItem value="3">1 <ArrowRightAltIcon className='reverse-arrow' />  3</MenuItem>
                        <MenuItem value="4">1 <ArrowRightAltIcon className='reverse-arrow' />  4</MenuItem>
                        <MenuItem value="5">1 <ArrowRightAltIcon className='reverse-arrow' />  5</MenuItem>
                        <MenuItem value="6">1 <ArrowRightAltIcon className='reverse-arrow' />  6</MenuItem>
                        <MenuItem value="7">1 <ArrowRightAltIcon className='reverse-arrow' />  7</MenuItem>
                        <MenuItem value="8">1 <ArrowRightAltIcon className='reverse-arrow' />  8</MenuItem>
                        <MenuItem value="9">1 <ArrowRightAltIcon className='reverse-arrow' />  9</MenuItem>
                        <MenuItem value="10">1 <ArrowRightAltIcon className='reverse-arrow' />  10</MenuItem>
                        <MenuItem value="11">1 <ArrowRightAltIcon className='reverse-arrow' />  11</MenuItem>
                        <MenuItem value="12">1 <ArrowRightAltIcon className='reverse-arrow' />  12</MenuItem>
                    </Select>
                </div> : ""}
            </div></div>{ColumnOrderReverse ? <div className="column-order-reverse"> <button type="button" onClick={() => { setcolumnReverse(!columnReverse) }}> Column Order Reverse</button></div> : ""}
        <div className="results-and-boxes">
            <div className="parent-column-collection-container">
                {AddButton ? <button type="button"
                    onClick={(e) => {
                        if (ColumnCollection.length < 6)
                            dispatch(addColumn())
                    }} className="add-column"><AddIcon className='icon-class' />
                </button> : ""}
                <div ref={containerDiv} style={{ flexDirection: columnReverse ? "row-reverse" : "row" }} className="column-collection-container">

                    {Visibility &&
                        ColumnCollection.map((elem, idx) => {
                            return <ColumnComponent PopAddAudioReverse={POP_ADD_AUDIO_REVERSE_LIST[idx]} PopAddAudio={POP_ADD_AUDIO_LIST[idx]} stacking={stacking[idx]} _setstacking={setStackingData} HighLight={HighLightList[idx]} setHighLight={setHighLight} columnReverse={columnReverse} borderColor={colorList[idx % colorList.length]} alterVisibility={alterVisibility} visibility={visibilityList[idx]} ShowTokenLabel={ShowTokenLabel} constrainsRef={containerDiv} order={idx} base={Base} key={idx}

                            />
                        })
                    }

                </div>
                {RemoveButton ? <button type="button"
                    onClick={(e) => {
                        ColumnCollection.length > 2 ? dispatch(removeColumn()) : "";
                    }} className="remove-column"><RemoveIcon className="icon-class" />
                </button> : ""}
            </div>
        </div>

        <div className="result"><div style={{ cursor: "cell" }}><div>{"= "} {totalValue()}</div> <div className="base-10-note">in Base 10</div></div></div>

    </div>
    )
}

export default Columns; 