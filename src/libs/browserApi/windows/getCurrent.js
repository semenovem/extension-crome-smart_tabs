/**
 * Получить информацию по текущему окну и вкладкам
 * Конвертация данных окна
 * на выходе объект:
 *
 * {
 *      id: {number}    id окна
 *      width:
 *      height:
 *      left:
 *      top:
 *      alwaysOnTop:
 *      focused:
 *      type:
 *
 *      // опционально, если передан параметр populate: true
 *      [tabs]: [
 *          {
 *              active:
 *              url:
 *              title:
 *              favIconUrl:
 *          }
 *      ]
 * }
 *
 * @param {object} [params] параметры
 * @return {Promise.<object>}
 */
app.browserApi.windows.getCurrent = function (params) {
    let timer;

    // параметры по умолчанию
    const paramsOrig = {
        populate: false
    };

    const queryParams = params ? Object.assign(paramsOrig, params) : paramsOrig;

    return new Promise((resolve, reject) => {
        timer = setTimeout(reject, 1000);
        window.chrome.windows.getCurrent(queryParams, resolve);
    })
        .then(kitEvent => {
            clearTimeout(timer);

            const kitView = this.conv(kitEvent);
            if (!queryParams.populate || kitView.tabs) {
                return kitView;
            } else {
                throw {
                    name: 'Данные окна не прошли валидацию'
                };
            }
        });
};
