/** Creating an array instance with callbacks being hooked to defined array methods.
 * @param callbacks : object with keys - names of the array (or custom) methods to be redefined, and values - callbacks, that
 * are hooked to these methods. Callback gets the array as an argument.
 */

// function createObservableArray<T>(callbacks: {
//   [key: string]: (args: any) => void;
// }) {
//   const arr: T[] = [];
//   Object.keys(callbacks).forEach((method) => {
//     // @ts-ignore
//     arr[method] = function () {
//       // @ts-ignore
//       const res = Array.prototype[method].apply(arr, arguments);
//       callbacks[method](arr);
//       return res;
//     };
//   });
//   return arr;
// }

type ListMethods = "onAdd" | "onRemove" | "onEdit" | "onEditAll";

/** Creating of observable array of objects (not literals)
 * @namespace {T} ObservableList
 * @param { [key in ListMethods]: (args?: any) => void } callbacks - list of objects mapped to observable array events :
 * "onAdd" | "onRemove" | "onEdit" | "onEditAll".
 * Each of events is a field name -  callback os the value.
 * The callback is given the actual elements list as an argument on it's call.
 */
export class ObservableList<T> {
  callbacks: { [key in ListMethods]: (args?: T[]) => void };
  #list: T[];

  constructor(callbacks: { [key in ListMethods]: (args?: any) => void }) {
    this.callbacks = callbacks;
    this.#list = [];
  }

  get getAll() {
    return this.#list;
  }

  /** Adding element to list */
  add(element: T) {
    this.#list = [...this.#list, element];
    this.callbacks?.onAdd(this.getAll);
  }

  /** Edit list element
   * @param  { field: keyof T; value: string | undefined } elementToEdit - the field name and field value of the element needed to be edited.
   * @param { Partial<T>} newData - the field name to change and the new value for it.
   */
  edit(
    { field, value }: { field: keyof T; value: string | undefined },
    newData: Partial<T>
  ) {
    if (!field || !value) return;
    const indexTochange = this.#list.findIndex((element) => {
      return element[field] === value;
    });
    const newList = [...this.#list];
    newList[indexTochange] = { ...newList[indexTochange], ...newData };
    this.#list = [...newList];
    this.callbacks?.onEdit(this.getAll);
  }

  /** Edit all list elements.
   *  @param {Partial<T>} newData - the field name to change for all list elements and the new value for it.
   */
  editAll(newData: Partial<T>) {
    this.#list = this.#list.map((entry) => ({ ...entry, ...newData }));
    this.callbacks?.onEditAll(this.getAll);
  }

  /** Removing one element.
   *  @param {field: keyof T; value: string | undefined } elementToRemove  - the field name and its value of the element to be removed.
   */
  remove({ field, value }: { field: keyof T; value: string | undefined }) {
    this.#list = this.#list.filter((element) => element[field] !== value);
    this.callbacks?.onRemove(this.getAll);
  }

  /** Finding one element.
   *  @param {field: keyof T; value: string | undefined } elementToFind  - the field name and its value of the element to be found.
   */
  find({ field, value }: { field: keyof T; value: string | undefined }) {
    if (!value) return undefined;
    return this.#list.find((element) => element[field] === value);
  }
}
