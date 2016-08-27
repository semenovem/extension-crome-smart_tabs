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
    // </

    /**
     * Проверка совместимости приложения с платформой
     * @returns {Promise}
     */
    check() {
        return new Promise((resolve, reject) => {
            try {
                if (typeof window.chrome === 'undefined') {
                    throw('нет объекта chrome');
                }

                if (typeof window.chrome.tabs === 'undefined') {
                    throw('нет объекта chrome.tabs');
                }
                app.chrome = window.chrome;
                app.chromeTabs = window.chrome.tabs;
                resolve(this._app);
            }
            catch (e) {
                this._app.log.error({
                    // <debug>
                    name: 'Совместимость с платформой',
                    note: 'Приложение не прошло проверку на совместимость с платформой',
                    $className: this.$className,
                    // </debug>
                    code: 0,
                    event: e
                });
                reject(e);
            }
        });
    }
};
