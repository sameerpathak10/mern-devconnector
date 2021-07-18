import {createStore, applyMiddleware } from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

const initialState = {};
const middlerware = [thunk];
    
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlerware))
);

export default store;