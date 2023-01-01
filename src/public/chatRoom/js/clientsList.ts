import { ClientListEntryType } from "../../../commonTypes/ChatRoomTypes";
import {
  ObservableList,
} from "../../../helpers/createObservableList";
import { clientsListRender } from "./componentsRender";

let clientsListEntries = new ObservableList<ClientListEntryType>({
  onAdd: clientsListRender,
  onRemove: clientsListRender,
  onEdit: clientsListRender,
  onEditAll: clientsListRender,
});

export { clientsListEntries };
