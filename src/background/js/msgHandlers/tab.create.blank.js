/**
 * Создание пустого окна
 * context = app
 *
 * implementation
 * подготавливаем параметры открытия нового окна для browserApi
 * открываем новое окно
 *
 *
 *
 *
 * @param {object} params
 * @param {Promise<object>} модель нового окна
 */
app.defineMsgHandler('tab.blank.create', function(params) {

    // todo переделать на работу с browserApi
    window.chrome.tabs.create(
        {
            url: 'chrome-extension://ekekhdhcpbbhfldpaoelpcpebkcmnkjh/blank.html',
            active: false
        }
    );

    return Promise.resolve();
});
