/**
 *
 * @return {function}
 * @constructor
 */
app.Ready = function() {
    /**
     *
     * Статичесткие методы
     * resolve
     * reject
     *
     * Свойство:
     * is   false / true  готов / не готов
     *
     * @return {Promise}
     */
    const f = function() {
        return promise;
    };
    f.is = false;
    const promise = new Promise((resolve, reject) => {
        f.resolve = (arg) => {
            f.is = true;
            resolve(arg);
        };
        f.reject = reject;
    });
    return f;
};
