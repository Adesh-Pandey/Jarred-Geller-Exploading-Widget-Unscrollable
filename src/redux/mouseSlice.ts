import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface DotState {
    base: number,
    mouseDown: boolean,
    mouseupLocation: number,
    mouseDownSource: number,
    mouseDownCircle: number,
    InnerCirclesList: number[],
    ColumnCollection: number[],
    TemporaryDiableList: number[]
}


const initialState: DotState = {
    base: 2,
    mouseDown: false,
    mouseupLocation: -1,
    mouseDownSource: -1,
    mouseDownCircle: -1,
    InnerCirclesList: [0, 0, 0],
    ColumnCollection: [0, 1, 2],
    TemporaryDiableList: [0, 0, 0]
}

export const DotSlice = createSlice({
    name: 'allState',
    initialState,
    reducers: {
        clearAllStateInTheReduxState: (state) => {
            state.base = 2;
            state.mouseDown = false;
            state.mouseupLocation = -1;
            state.mouseDownSource = -1;
            state.mouseDownCircle = -1;
            state.InnerCirclesList = [0, 0, 0];
            state.ColumnCollection = [0, 1, 2];
            state.TemporaryDiableList = [0, 0, 0]
        },
        resetCircles: (state, action: PayloadAction<number>) => {
            if (state.TemporaryDiableList[action.payload] == -1) {
                return;
            }
            state.InnerCirclesList[action.payload] = 0;
            state.TemporaryDiableList[action.payload] = 0;

        },
        temporaryDisable: (state, action: PayloadAction<number>) => {
            if (state.TemporaryDiableList[action.payload] != -1) {
                state.TemporaryDiableList[action.payload] = -1;
            } else {
                state.TemporaryDiableList[action.payload] = state.InnerCirclesList[action.payload]
            }

        }

        ,
        removeColumn: (state) => {
            if (state.ColumnCollection.length == 1) {
                return;
            }
            state.ColumnCollection.splice(state.ColumnCollection.length - 1, 1);
            state.InnerCirclesList.splice(state.InnerCirclesList.length - 1, 1);
            state.TemporaryDiableList.splice(state.InnerCirclesList.length - 1, 1);
        },
        changeBase: (state, action: PayloadAction<number>) => {
            state.base = action.payload
        },
        addColumn: (state) => {
            state.ColumnCollection.push(state.ColumnCollection.length);
            state.InnerCirclesList.push(0);
            state.TemporaryDiableList.push(0);
        }
        ,
        mouseDownOnTheToken: (state, action: PayloadAction<number[]>) => {
            state.mouseDown = true;
            state.mouseDownSource = action.payload[0];
            state.mouseDownCircle = action.payload[1]
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

    },
})

// Action creators are generated for each case reducer function
export const { clearAllStateInTheReduxState,
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