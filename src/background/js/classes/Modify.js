/**
 *
 *
 * @param {object} opts
 *
 * @return {function}
 * Статичесткие методы
 * clear()              сбросить значение в false
 * run([arg, [arg]])    выполнить callback
 * desctroy()           удаление объекта
 *
 *
 * Свойство:
 * is   true / false  модифицирован / нет
 * timeCall
 *
 * @constructor
 */
app.Modify = function(opts) {

    //  Внутренный контекст
    let ctx = Object.create(null);
    ctx.timer = null;
    ctx.delay = opts.delay;
    ctx.callback = opts.callback;
    ctx.is = false;
    ctx.timeCall = 0;

    /**
     *
     * @param a
     */
    function modify(...a) {
        ctx.args = a;
        ctx.timeCall = Date.now();
        if (!ctx.is) {
            ctx.is = true;
            timeout(ctx.delay);
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
};
