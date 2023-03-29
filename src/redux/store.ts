import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import counterReducer from './mouseSlice'
import thunk from "redux-thunk"

export const store = configureStore({
    reducer: {
        allState: counterReducer,
    },
    // applyMiddleware(thunk)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch