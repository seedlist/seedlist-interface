import { createStore } from 'redux';

import {reducers} from "./index"
import {StoreType} from "./state";
const newStore = (): StoreType => createStore(reducers);

export {newStore};
