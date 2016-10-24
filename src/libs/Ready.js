/**
 * Состояние готовности.
 * Использование:
 * const ready = Ready();
 *
 * // операции, которые будут выполнены после успешного выполнения промиса
 * ready().then( .... )
 * ready().then( .... )
 * ready().then( .... )
 *
 *
 * // после выполнения запланированных действий, для подготовки объекта к работе
 * ready.resolve();
 *
 * // если в процессе подготовки объекта к работе возникла ошибка
 * ready.reject();
 *
 *
 * @return {function}
 *
 * @constructor
 */
function Ready() {
    /**
     * Возвращает промис состояния готовности
     *
     * Статичесткие методы
     * resolve      успешное выполение промиса
     * reject       промис выполнился с ошибкой
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
