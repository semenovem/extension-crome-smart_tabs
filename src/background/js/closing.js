/**
 * закрытие приложения
 * @function
 * @param {object} opts
 */
app.closing = function(opts = {}) {
    console.log('закрытие');

    // снять обработчики
    this.collectController.unsubscribe('all');

    switch (opts.type) {

        // приложение упало
        case 'crach':

            // разрешение на отправку сообщения о падении
            if (this.setup.get('reportCrash')) {
                // отправка ссобщения о crash
            }

            // записать пометку о падении в localStore
            // при запуске проверить, где упали и если возможно, не ходить туда

            break;
    }

    // удалить объект в глобальной области видимости
    if (typeof window === 'object' && window[this.globalName]) {
        window[this.globalName] = null;
    }
};



