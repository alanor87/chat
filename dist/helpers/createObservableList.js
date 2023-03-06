/** Creating an array instance with callbacks being hooked to defined array methods.
 * @param callbacks : object with keys - names of the array (or custom) methods to be redefined, and values - callbacks, that
 * are hooked to these methods. Callback gets the array as an argument.
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ObservableList_list;
/** Creating of observable array of objects (not literals)
 * @namespace {T} ObservableList
 * @param { [key in ListMethods]: (args?: any) => void } callbacks - list of objects mapped to observable array events :
 * "onAdd" | "onRemove" | "onEdit" | "onEditAll".
 * Each of events is a field name -  callback os the value.
 * The callback is given the actual elements list as an argument on it's call.
 */
export class ObservableList {
    constructor(callbacks) {
        _ObservableList_list.set(this, void 0);
        this.callbacks = callbacks;
        __classPrivateFieldSet(this, _ObservableList_list, [], "f");
    }
    get getAll() {
        return __classPrivateFieldGet(this, _ObservableList_list, "f");
    }
    /** Adding element to list */
    add(element) {
        var _a;
        __classPrivateFieldSet(this, _ObservableList_list, [...__classPrivateFieldGet(this, _ObservableList_list, "f"), element], "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onAdd(this.getAll);
    }
    /** Edit list element
     * @param  { field: keyof T; value: string | undefined } elementToEdit - the field name and field value of the element needed to be edited.
     * @param { Partial<T>} newData - the field name to change and the new value for it.
     */
    edit({ field, value }, newData) {
        var _a;
        if (!field || !value)
            return;
        const indexTochange = __classPrivateFieldGet(this, _ObservableList_list, "f").findIndex((element) => {
            return element[field] === value;
        });
        const newList = [...__classPrivateFieldGet(this, _ObservableList_list, "f")];
        newList[indexTochange] = Object.assign(Object.assign({}, newList[indexTochange]), newData);
        __classPrivateFieldSet(this, _ObservableList_list, [...newList], "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onEdit(this.getAll);
    }
    /** Edit all list elements.
     *  @param {Partial<T>} newData - the field name to change for all list elements and the new value for it.
     */
    editAll(newData) {
        var _a;
        __classPrivateFieldSet(this, _ObservableList_list, __classPrivateFieldGet(this, _ObservableList_list, "f").map((entry) => (Object.assign(Object.assign({}, entry), newData))), "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onEditAll(this.getAll);
    }
    /** Removing one element.
     *  @param {field: keyof T; value: string | undefined } elementToRemove  - the field name and its value of the element to be removed.
     */
    remove({ field, value }) {
        var _a;
        __classPrivateFieldSet(this, _ObservableList_list, __classPrivateFieldGet(this, _ObservableList_list, "f").filter((element) => element[field] !== value), "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onRemove(this.getAll);
    }
    /** Finding one element.
     *  @param {field: keyof T; value: string | undefined } elementToFind  - the field name and its value of the element to be found.
     */
    find({ field, value }) {
        if (!value)
            return undefined;
        return __classPrivateFieldGet(this, _ObservableList_list, "f").find((element) => element[field] === value);
    }
}
_ObservableList_list = new WeakMap();
