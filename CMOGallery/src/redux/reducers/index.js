import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./loginReducer";
import registerReducer from "./registerReducer";
import filterReducer from "./filterReducer";
import eventReducer from "./EventReducer";
import NetworkReducer from "./NetworkReducer";

const rootReducer = combineReducers({
    login:loginReducer,
    register:registerReducer,
    filter:filterReducer,
    event:eventReducer,
    network:NetworkReducer
})

export default rootReducer