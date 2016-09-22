/**
 * браузерные API
 */
app.browserApi = {
    // <debug>
    $className: 'browserApi',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * @type {number} таймаут, после которого запрос к api браузера считается зависшим
     */
    _TIME_OUT_HAND: 3000,

    /**
     * получить все открытые окна
     * @return {Promise.<T>}
     */
    kitAll() {
        return new Promise((resolve, reject) => {
            setTimeout(reject, this._TIME_OUT_HAND);

            window.chrome.windows.getAll(
                {
                    populate: true
                },
                resolve
            )
        })
            .then(eventKits => {
                const kitsRaw = eventKits.map(this._kit).filter(kit => kit);
                if (!kitsRaw.length) {
                    throw {
                        name: 'Данные всех окон не прошли валидацию'
                    };
                }
                return kitsRaw;
            })
            .catch(this._failure);
    },

    /**
     * Получить информацию по окну и вкладкам
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
     *      tabs: [
     *          {
     *              active:
     *              url:
     *              title:
     *              favIconUrl:
     *          }
     *      ]
     * }
     *
     * @param {number} id идентификатор окна
     * @return {Promise.<object>}
     */
    kit(id) {
        return new Promise((resolve, reject) => {
            // таймер на зависание. если в течение указаного времени ответа от api не последовало
            setTimeout(reject, this._TIME_OUT_HAND);

            window.chrome.windows.get(
                id,
                {
                    populate: true
                },
                resolve
            )
        })
            .then(eventKit => {
                return this._kit(eventKit) || Promise.reject('Данные окна не прошли валидацию');
            })
            .catch(this._failure)
    },

    /**
     * Конвертация объекта, который возвращает api браузера
     * @param eventKit
     * @return {*}
     * @private
     */
    _kit(eventKit) {
        const kitRaw = this._kitConv(eventKit);
        if (kitRaw) {
            kitRaw.tabs = this._tabsConv(eventKit.tabs);
        }
        return kitRaw && kitRaw.tabs.length ? kitRaw : null;
    },

    /**
     * Ошибка при конвертации
     * @param e
     * @return {Promise<null>}
     * @private
     */
    _failure(e) {
        console.warn('browserApi: ', e);

        // записать в log событие
        // вернут null
        return Promise.reject(null);
    },

    // ################################################
    // методы конвертации
    // ################################################

    /**
     * Конвертация объекта, возвращенного событием браузерного api в программный
     * который будет использоватся дальше
     *
     * {
     *      id:             {number}    id окна
     *      width:          {number}
     *      height:         {number}
     *      left:           {number}
     *      top:            {number}
     *      alwaysOnTop:    {boolean}
     *      focused:        {boolean}
     *      type:           {string}
     *
     * }
     *
     * @param eventKit
     * @return {object|null}
     * @private
     */
    _kitConv(eventKit) {
        return eventKit && typeof eventKit === 'object' &&
            this._app.kitConv.validateRaw(
                this._app.kitConv.normalize({
                    id: eventKit.id,
                    //   focused: eventKit.focused,
                    left: eventKit.left,
                    top: eventKit.top,
                    width: eventKit.width,
                    height: eventKit.height,
                    //state: eventKit.state,
                    //type: eventKit.type,
                })
            ) || null;
        // todo сделать логирование ошибок валидации
    },

    /**
     * Конвертация массива вкладок
     * @param {*} eventTabs
     * @return {Array}
     * @private
     */
    _tabsConv(eventTabs) {
        return Array.isArray(eventTabs) && eventTabs.map(this._tabConv).filter(t=>t) || [];
    },

    /**
     * Конвертация данных вкладки
     *
     *
     *  {
     *      active:
     *      url:
     *      title:
     *      favIconUrl:
     *  }
     *
     *
     * @param {*} eventTab
     * @return {object|null}
     * @private
     */
    _tabConv(eventTab) {
        return eventTab && typeof eventTab === 'object' &&
            this._app.kitConv.validateRaw(
                this._app.kitConv.normalize({
                    id: eventTab.id,
                    //active: eventTab.active,
                    //audible: eventTab.audible,
                    favIconUrl: eventTab.favIconUrl,
                    //highlighted: eventTab.highlighted,
                    //incognito: eventTab.incognito,
                    //index: eventTab.index,
                    //pinned: eventTab.pinned,
                    //selected: eventTab.selected,
                    //status: eventTab.status,
                    title: eventTab.title,
                    url: eventTab.url
                })
            ) || null;
        // todo сделать логирование ошибок валидации
    }
};
