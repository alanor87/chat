/** Creating an array instance with callbacks being hooked to defined array methods.
 * @param callbacks : object with keys - names of the array methods to be redefined, and values - callbacks, that
 * are hooked to these methods. Callback gets the array as an argument.
 */
function createObservableArray(callbacks) {
    const arr = [];
    Object.keys(callbacks).forEach((method) => {
        if (!Array.prototype.hasOwnProperty(method))
            return;
        // @ts-ignore
        arr[method] = function () {
            // @ts-ignore
            var res = Array.prototype[method].apply(arr, arguments);
            callbacks[method](arr);
            return res;
        };
    });
    return arr;
}
export { createObservableArray };
