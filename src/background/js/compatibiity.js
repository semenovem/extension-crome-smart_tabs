/**
 * Проверка совместимости приложения с браузером
 */
app.compatibility = {
    // <debug>
    $className: 'Compatibility',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    _ITEM_TEST: '_test',

    /**
     * Проверка совместимости приложения с платформой
     * @returns {Promise}
     */
    check() {
        return new Promise((resolve, reject) => {

            if (typeof window.chrome === 'undefined') {
                reject('нет объекта chrome');
            }

            if (typeof window.chrome.tabs === 'undefined') {
                reject('нет объекта chrome.tabs');
            }

            if (typeof window.chrome.windows === 'undefined') {
                reject('нет объекта chrome.windows');
            }


            // проверка localStorage
            if (typeof window.localStorage === 'undefined') {
                reject('нет объекта localStorage');
            }
            const test = this._ITEM_TEST + Math.random();
            localStorage.setItem(this._ITEM_TEST, test);
            if (localStorage.getItem(this._ITEM_TEST) !== test) {
                reject('ошибка при записи в localStorage');
            }
            localStorage.removeItem(this._ITEM_TEST);

            app.chrome = window.chrome;
            app.chromeTabs = window.chrome.tabs;
            app.chromeWindows = window.chrome.windows;
            resolve(this._app);
        })
            .catch(e => {
                this._app.log.error({
                    // <debug>
                    name: 'Совместимость с платформой',
                    note: 'Приложение не прошло проверку на совместимость с платформой',
                    $className: this.$className,
                    // </debug>
                    code: 0,
                    event: e
                });
                throw(e);
            });
    }
};
