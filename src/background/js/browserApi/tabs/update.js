/**
 * @type {object} обновление данных вкладки
 * @param {number} tabId
 * @param {object} params
 *
 */
app.browserApi.tabs.update = function(tabId, params) {
    const props = {};

    if (params.url) {
        props.url = params.url;
    }
    if (params.active) {
        props.active = params.active;
    }

    let timer;
    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.tab.update.resetQuery')
        );

        window.chrome.tabs.update(tabId, props, resolve);
    })
        .then(tabEvent => {
            clearTimeout(timer);
            const tabView = this.conv(tabEvent);

            if (tabView) {
                return tabView;
            } else {
                throw {
                    name: 'Данные вкладки не прошли валидацию'
                };
            }
        });
};
