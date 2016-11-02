/**
 * метод, предоставляющий задержку запуска событий
 *
 * @param {object} opts
 * {
 *      delay: {number}         кол-во ms ожидания
 *      callback {function}     вызвать по истечении времении dalay
 * }
 *
 * @return Function
 *
 * Статичесткие методы
 * clear()              привести объект в первоначальное состояние, сбросить текущий отсчет времени
 * run([arg, [arg]])    выполнить callback
 * desctroy()           удаление объекта
 *
 * suspend()            остановить таймер (если был запущен)
 * resume()             восстановить срабатывания по таймеру
 *
 *
 * Свойство:
 * is           true / false  модифицирован / нет
 * timeCall     время последнего вызова
 *
 *
 * constructo
 */
function Modify(opts) {

    //  Внутренный контекст
    let ctx = Object.create(null);
    ctx.timer = null;
    ctx.delay = opts.delay;
    ctx.callback = opts.callback;
    ctx.is = false;
    ctx.timeCall = 0;
    // имитация стека приостановленных комманд
    // не нужно хранить какие либо данные - просто кол-во раз остановлено, должно равнятся кол-ву раз запуска
    ctx.stackSuspended = 0;

    /**
     * Этой функции добавляем статические методы
     *
     * @param a
     */
    function modify(...a) {
        ctx.args = a;
        ctx.timeCall = Date.now();
        if (!ctx.is) {
            ctx.is = true;
            ctx.stackSuspended || timeout(ctx.delay);
        }
    }

    // ################################################
    // статические методы
    // ################################################

    /**
     * Сброс таймера
     */
    modify.clear = () => {
        if (ctx.is) {
            clearTimeout(ctx.timer);
            ctx.is = false;
        }
    };

    /**
     * Удаление объекта
     */
    modify.destroy = () => {
        if (ctx.is) {
            clearTimeout(ctx.timer);
        }

        for (let key in ctx) {
            delete ctx[key];
        }
        ctx = null;
        delete modify.clear;
        delete modify.destroy;
        delete modify.run;
    };

    /**
     * Немедленный запуск callback
     */
    modify.run = (...a) => {
        ctx.args = a;
        if (ctx.is) {
            clearTimeout(ctx.timer);
        }
        run();
    };

    /**
     * Установить задержку
     * @param delay
     */
    modify.setDelay = (delay) => {
        ctx.delay = delay;
    };

    /**
     * Установить задержку
     * @param callback
     */
    modify.setCallback = (callback) => {
        ctx.callback = callback;
    };

    /**
     * Приостановить таймер
     */
    modify.suspend = () => {
        if (ctx.stackSuspended++ === 0 && ctx.is) {
            clearTimeout(ctx.timer);
        }
    };

    /**
     * Запустить таймер (если был остановлен ранее)
     */
    modify.resume = () => {
        if (ctx.stackSuspended > 0 && --ctx.stackSuspended === 0 && ctx.is) {
            setTimeout(timeoutCheck, 1);
        }
    };

    // ################################################
    // статические свойства
    // ################################################

    /**
     * Текущее состояние
     */
    Object.defineProperties(modify, {
        'is': {
            get() {
                return ctx.is;
            },
            set() {}
        }
    });

    /**
     * Время последнего вызова
     */
    Object.defineProperties(modify, {
        'timeCall': {
            get() {
                return ctx.timeCall;
            },
            set() {}
        }
    });


    // ################################################
    // внутренние методы
    // ################################################

    /**
     * Запуск задержки
     * @param {number} delay
     * @private
     */
    function timeout(delay) {
        ctx.timer = setTimeout(timeoutCheck, delay);
    }

    /**
     * Проверка окончания задержки
     * @private
     */
    function timeoutCheck() {
        const diff = Date.now() - ctx.timeCall;
        diff < ctx.delay ? timeout(ctx.delay - diff) : run();
    }

    /**
     * Выполнение callback, время вышло
     * @private
     */
    function run() {
        if (ctx.is) {
            ctx.is = false;
        }
        ctx.callback.apply(null, ctx.args);
        ctx.args = null;
    }

    return modify;
}
