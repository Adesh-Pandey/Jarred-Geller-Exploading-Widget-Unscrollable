import { useState, useEffect, useRef } from 'react'
import ColumnComponent from './ColumnComponent';
import "./column.css"
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useSelector, useDispatch } from 'react-redux'
import AddIcon from '@mui/icons-material/Add';

import RemoveIcon from '@mui/icons-material/Remove';

import { addColumn, changeBase, clearAllStateInTheReduxState, mouseDownOnTheToken, mouseUpOnColumn, removeColumn } from './redux/mouseSlice'
import type { RootState } from './redux/store'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function Columns() {
    const Base = useSelector((state: RootState) => state.allState.base)
    const [MouseDown, setMouseDown] = useState(false);
    const [Visibility, setVisibility] = useState(true)
    const containerDiv = useRef<HTMLDivElement>(null);
    const selectRef: any = useRef(null);
    const dispatch = useDispatch()
    const ColumnCollection = useSelector((state: RootState) => state.allState.ColumnCollection)
    const [selected, setselected] = useState("2")
    const [ShowTokenLabel, setShowTokenLabel] = useState(true)
    const TemporaryDisabledList = useSelector((state: RootState) => state.allState.TemporaryDiableList)

    const [visibilityList, setvisibilityList] = useState([...Array(ColumnCollection.length)].map(x => true))

    const handleSelectChange = (event: any) => {
        dispatch(changeBase(Number(event.target.value))); setselected(event.target.value);
    }
    const totalValue = () => {
        let finalVal = 0;
        for (let index = 0; index < TemporaryDisabledList.length; index++) {
            finalVal += TemporaryDisabledList[index] != -1 ? TemporaryDisabledList[index] * Base ** (index) : 0;

        }
        return finalVal;
    }
    const alterVisibility = (order: number) => {
        let newList = [...visibilityList]
        newList[order] = !newList[order];
        setvisibilityList([...newList]);
    }

    const ClearAllState = () => {
        dispatch(clearAllStateInTheReduxState())
        setvisibilityList([...Array(ColumnCollection.length)].map(x => true));
        setShowTokenLabel(true);
        setselected("2");
    }

    useEffect(() => {
        setvisibilityList([...Array(ColumnCollection.length)].map(x => true));
    }, [ColumnCollection])


    return (<div className='main-app-wrapper-container'>
        <div className='show-label-restart'><div>
            <input className='show-tokens' type="checkbox" checked={ShowTokenLabel} value={ShowTokenLabel ? 1 : 0} onChange={() => {
                setShowTokenLabel(!ShowTokenLabel);
            }} /> Show Token Label</div> <button onClick={() => { ClearAllState() }}>Restart</button></div>

        <div className="choose-conversion">
            <div className="borderless-div">
                <div className="choose-conversion-list">

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
                </div>
            </div></div>
        <div className="results-and-boxes">
            <div className="parent-column-collection-container">
                <button
                    onClick={(e) => {
                        dispatch(addColumn())
                    }} className="add-column"><AddIcon className='icon-class' />
                </button>
                <div ref={containerDiv} className="column-collection-container">

                    {Visibility &&
                        ColumnCollection.map((elem, idx) => {
                            return <ColumnComponent alterVisibility={alterVisibility} visibility={visibilityList[idx]} ShowTokenLabel={ShowTokenLabel} constrainsRef={containerDiv} order={idx} base={Base} key={idx}

                            />
                        })
                    }

                </div>
                <button
                    onClick={(e) => {
                        dispatch(removeColumn())
                    }} className="remove-column"><RemoveIcon className="icon-class" />
                </button>
            </div>
        </div>
        <div className="result">
            ={" "} {totalValue()}
        </div>
    </div>
    )
}

export default Columns; 