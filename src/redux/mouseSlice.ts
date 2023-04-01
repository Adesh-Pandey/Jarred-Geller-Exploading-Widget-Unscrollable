import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface DotState {
    base: number,
    mouseDown: boolean,
    mouseupLocation: number,
    mouseDownSource: number,
    InnerCirclesList: number[],
    ColumnCollection: number[],
    TemporaryDiableList: number[],
    HighLightList: boolean[],

}


const initialState: DotState = {
    base: 2,
    mouseDown: false,
    mouseupLocation: -1,
    mouseDownSource: -1,
    InnerCirclesList: [0, 0, 0],
    ColumnCollection: [0, 1, 2],
    TemporaryDiableList: [0, 0, 0],
    HighLightList: [false, false, false]
}



export const DotSlice = createSlice({
    name: 'allState',
    initialState,
    reducers: {
        HighLightEvent: (state, action: PayloadAction<number[]>) => {
            state.HighLightList[action.payload[0]] = action.payload[1] == 1 ? true : false;
        }
        ,
        clearAllStateInTheReduxState: (state) => {
            state.base = 2;
            state.mouseDown = false;
            state.mouseupLocation = -1;
            state.mouseDownSource = -1;
            state.InnerCirclesList = [0, 0, 0];
            state.ColumnCollection = [0, 1, 2];
            state.TemporaryDiableList = [0, 0, 0]
            state.HighLightList = [false, false, false]
        },
        resetCircles: (state, action: PayloadAction<number>) => {
            if (state.TemporaryDiableList[action.payload] == -1) {
                return;
            }
            state.InnerCirclesList[action.payload] = 0;
            state.TemporaryDiableList[action.payload] = 0;

        },
        temporaryDisable: (state, action: PayloadAction<number[]>) => {
            if (action.payload[1] == -1) {
                state.TemporaryDiableList[action.payload[0]] = action.payload[1];
            } else {
                state.TemporaryDiableList[action.payload[0]] = state.InnerCirclesList[action.payload[0]]
            }

        }

        ,
        setListsFromServer: (state, action: PayloadAction<number[][]>) => {
            state.TemporaryDiableList = action.payload[0]
            state.InnerCirclesList = action.payload[1]
            state.ColumnCollection = action.payload[2]
        },

        setHighLightsFromServer: (state, action: PayloadAction<boolean[]>) => {
            state.HighLightList = action.payload
        },

        removeColumn: (state) => {
            if (state.ColumnCollection.length <= 1) {
                return;
            }
            state.ColumnCollection.pop()
            state.InnerCirclesList.pop();
            state.HighLightList.pop()
            state.TemporaryDiableList.pop()
        },
        changeBase: (state, action: PayloadAction<number>) => {
            state.base = action.payload
        },
        addColumn: (state) => {
            state.ColumnCollection.push(state.ColumnCollection.length);
            state.InnerCirclesList.push(0);
            state.TemporaryDiableList.push(0);
            state.HighLightList.push(false)
        },
        setColumnLengthTo: (state, action: PayloadAction<number>) => {
            let NewColumnCollection = [[...state.ColumnCollection], [...state.InnerCirclesList], [...state.TemporaryDiableList]];

            if (NewColumnCollection[0].length < action.payload) {
                while (NewColumnCollection[0].length < action.payload) {
                    NewColumnCollection[0].push(NewColumnCollection[0].length)
                    state.InnerCirclesList.push(0);
                    state.HighLightList.push(false)
                    state.TemporaryDiableList.push(0);
                }
                state.ColumnCollection = NewColumnCollection[0];
            } else {

                while (NewColumnCollection[0].length > action.payload) {
                    NewColumnCollection[0].pop()
                    state.HighLightList.pop()
                    NewColumnCollection[1].pop()
                    NewColumnCollection[2].pop()
                }
                state.ColumnCollection = NewColumnCollection[0];
                state.InnerCirclesList = NewColumnCollection[1];
                state.TemporaryDiableList = NewColumnCollection[2];
            }
        }
        ,
        mouseDownOnTheToken: (state, action: PayloadAction<number[]>) => {
            state.mouseDown = true;
            state.mouseDownSource = action.payload[0];
        },
        mouseUpOnColumn: (state, action: PayloadAction<number>) => {
            state.mouseDown = false;
            state.mouseupLocation = action.payload;

            if (state.mouseDownSource == action.payload) {
                state.mouseDownSource = -1;
                state.mouseupLocation = -1;
                return;
            }

            let goingToLower = false;
            let decider = state.mouseupLocation - state.mouseDownSource;
            if (decider < 0) {
                decider *= -1
                goingToLower = true;
            }
            const numberOfTokenRequired = state.base ** (decider)

            if (!goingToLower) {
                if (state.InnerCirclesList[state.mouseDownSource] >= numberOfTokenRequired) {

                    state.InnerCirclesList[state.mouseDownSource] -= numberOfTokenRequired;
                    state.InnerCirclesList[state.mouseupLocation] += 1;
                    state.TemporaryDiableList[state.mouseDownSource] -= numberOfTokenRequired;
                    state.TemporaryDiableList[state.mouseupLocation] += 1;
                }
            } else {
                state.InnerCirclesList[state.mouseDownSource] -= 1;
                state.InnerCirclesList[state.mouseupLocation] += numberOfTokenRequired;
                state.TemporaryDiableList[state.mouseDownSource] -= 1;
                state.TemporaryDiableList[state.mouseupLocation] += numberOfTokenRequired;
            }

            state.mouseupLocation = -1;
            state.mouseDownSource = -1;

        },
        addTokenInColumn: (state, action: PayloadAction<number>) => {

            state.mouseDown = false;
            if (state.TemporaryDiableList[action.payload] == -1) {
                return;
            }
            state.InnerCirclesList[action.payload] += 1;
            state.TemporaryDiableList[action.payload] += 1;
        },
        removeTokenInColumn: (state, action: PayloadAction<number>) => {
            state.mouseDown = false;
            if (state.TemporaryDiableList[action.payload] == -1) {
                return;
            }
            if (state.InnerCirclesList[action.payload] == 0) {
                return;
            }
            state.InnerCirclesList[action.payload] -= 1;
            state.TemporaryDiableList[action.payload] -= 1;
        },
        changeTokensInColumn: (state, action: PayloadAction<number[]>) => {
            // console.log(action.payload)
            state.InnerCirclesList[action.payload[0]] = action.payload[1];
            if (state.TemporaryDiableList[action.payload[0]] !== -1) {
                state.TemporaryDiableList[action.payload[0]] = action.payload[1]
            }
        },
        draggFromServer: (state, action: PayloadAction<number[]>) => {

            state.mouseupLocation = action.payload[1];
            state.mouseDownSource = action.payload[0]
            state.InnerCirclesList[state.mouseDownSource] = action.payload[2];
            state.InnerCirclesList[state.mouseupLocation] = action.payload[3];
            state.TemporaryDiableList[state.mouseDownSource] = action.payload[2];
            state.TemporaryDiableList[state.mouseupLocation] = action.payload[3];

            let goingToLower = false;
            let decider = state.mouseupLocation - state.mouseDownSource;
            if (decider < 0) {
                decider *= -1
                goingToLower = true;
            }
            const numberOfTokenRequired = state.base ** (decider)

            if (!goingToLower) {
                if (state.InnerCirclesList[state.mouseDownSource] >= numberOfTokenRequired) {

                    state.InnerCirclesList[state.mouseDownSource] -= numberOfTokenRequired;
                    state.InnerCirclesList[state.mouseupLocation] += 1;
                    state.TemporaryDiableList[state.mouseDownSource] -= numberOfTokenRequired;
                    state.TemporaryDiableList[state.mouseupLocation] += 1;
                }
            } else {
                state.InnerCirclesList[state.mouseDownSource] -= 1;
                state.InnerCirclesList[state.mouseupLocation] += numberOfTokenRequired;
                state.TemporaryDiableList[state.mouseDownSource] -= 1;
                state.TemporaryDiableList[state.mouseupLocation] += numberOfTokenRequired;
            }

            state.mouseupLocation = -1;
            state.mouseDownSource = -1;
        },

    },
})

// Action creators are generated for each case reducer function
export const { setHighLightsFromServer, setListsFromServer, draggFromServer, HighLightEvent, changeTokensInColumn
    , setColumnLengthTo
    , clearAllStateInTheReduxState,
    temporaryDisable,
    resetCircles,
    removeColumn,
    addColumn,
    changeBase,
    mouseDownOnTheToken,
    mouseUpOnColumn,
    addTokenInColumn,
    removeTokenInColumn } = DotSlice.actions

export default DotSlice.reducer;