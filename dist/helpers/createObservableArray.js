function createObservableArray(arr, callbacks) {
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
