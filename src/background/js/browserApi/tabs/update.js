/**
 * Обновление данных вкладки
 * @context app.browser.tabs
 * @type {object} обновление данных вкладки
 * @param {number} tabId
 * @param {object} params
 * @return {Promise.<app.dto.TabView>}
 */
app.browserApi.tabs.update = function(tabId, params) {
    const props = {};

    if (params.url) {
        props.url = params.url;
    }
    if (params.active) {
        props.active = params.active;
    }

    return new Promise((resolve, reject) => {
        setTimeout(
            reject,
            this._app.setup.get('browserApi.tab.update.resetQuery')
        );

        window.chrome.tabs.update(tabId, props, resolve);
    })
        .then(this.convDtoTabView)
        .catch(e => {
            console.error('--', e);
            throw '--' + e;
        })
};
