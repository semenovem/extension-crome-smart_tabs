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

            // проверка localStorage
            if (typeof window.localStorage === 'undefined') {
                reject('нет объекта localStorage');
            }
            const test = 'test_' + Math.random();
            localStorage.setItem('_test', test);
            if (localStorage.getItem('_test') !== test) {
                reject('ошибка при записи в localStorage');
            }

            app.chrome = window.chrome;
            app.chromeTabs = window.chrome.tabs;
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
