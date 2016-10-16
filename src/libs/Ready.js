/**
 *
 * @return {function}
 * @constructor
 */
function Ready() {
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
    const ready = function () {
        return promise;
    };

    const promise = new Promise((resolve, reject) => {
        ready.resolve = (arg) => {
            is = true;
            resolve(arg);
        };
        ready.reject = reject;
    });

    let is = false;


    // ################################################
    // статические свойства
    // ################################################

    /**
     * Текущее состояние
     */
    Object.defineProperties(ready, {
        'is': {
            get() {
                return is;
            },
            set() {}
        }
    });

    return ready;
}
