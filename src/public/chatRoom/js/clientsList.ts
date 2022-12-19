import { createObservableArray } from "../../../helpers/createObservableArray"
import { clientsListRender } from "./componentsRender"

const clientsListEmpty = [];
const clientsListEntries = createObservableArray(clientsListEmpty, {'push' : clientsListRender})

export {clientsListEntries}