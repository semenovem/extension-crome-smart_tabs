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


    /**
     * @type {number} таймаут, после которого запрос к api браузера считается зависшим
     */
    _TIME_OUT_HUNG: 0,
    // </debug>

    /**
     * @type {object} параметры запроса к браузерному api по умолчанию
     */
    param: {
        _kitAll: {
            populate: false
        },
        _kit: {
            populate: true
        },

        /**
         * Смешать параметры по умолчанию и переданные приложением, и конвертировать для api
         * пока конвертировать не нужно, если api будет изменятся - тогда сделать конвертацию
         * @param {string} optName название параметра по умолчанию
         * @param {object} params
         */
        mix(optName, params) {
            return Object.assign(this['_' + optName], params && typeof params && params || {});
        }
    },

    /**
     *
     */
    init() {
        this._app.binding(this);
        this._app.setup.get('timeout.browserApi.hung')
            .then(value => this._TIME_OUT_HUNG = value);
    },


    /**
     * Получить все открытые окна
     * @param {object|undefined} [params] параметры
     * @return {Promise.<Array>}
     */
    getKitAll(params) {
        let timer;
        return new Promise((resolve, reject) => {
            timer = setTimeout(reject, this._TIME_OUT_HUNG);

            window.chrome.windows.getAll(
                this.param.mix('kitAll', params),
                resolve
            );
        })
            .then(eDataKits => {
                clearTimeout(timer);

                const eKits = eDataKits
                    .map(eKit => eKit && typeof eKit === 'object' && this._kitTask(eKit))
                    .filter(eKit => eKit);

                if (!eKits.length) {
                    throw {
                        name: 'Данные всех окон не прошли валидацию'
                    };
                }
                return eKits;
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
     *      // если передан параметр populate: true
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
     * @param {object|undefined} [params] параметры
     * @return {Promise.<object>}
     */
    getKit(id, params) {
        let timer;
        const queryParams = this.param.mix('kit', params);

        return new Promise((resolve, reject) => {
            timer = setTimeout(reject, this._TIME_OUT_HUNG);
            window.chrome.windows.get(id, queryParams, resolve);
        })
            .then(eDataKit => {
                clearTimeout(timer);
                const eKit = this._kitTask(eDataKit);

                if (eKit && id === eKit.id && (!queryParams.populate || eKit.tabs.length)) {
                    return eKit;
                } else {
                    throw {
                        name: 'Данные окна не прошли валидацию'
                    };
                }
            })
            .catch(this._failure);
    },




    /**
     * Конвертация объекта, который возвращает api браузера
     * @param {object} eData
     * @return {object|null} _eKitToRaw
     * @private
     */
    _kitTask(eData) {
        let eKit = this._kitConv(eData);
        if (eKit && Array.isArray(eData.tabs)) {
            eKit.tabs = this._tabsConv(eData.tabs);
        }

        return eKit || null;
    },



    /**
     * Получить по вкладке
     * Конвертация данных
     * на выходе объект:
     * {
     *      active:
     *      url:
     *      title:
     *      favIconUrl:
     * }
     *
     * @param {number} id идентификатор вкладки
     * @return {Promise.<object>}
     */
    getTab(id) {
        let timer;

        return new Promise((resolve, reject) => {
            timer = setTimeout(reject, this._TIME_OUT_HUNG);
            window.chrome.tabs.get(id, resolve);
        })
            .then(eDataTab => {
                clearTimeout(timer);
                const eTab = this._tabConv(eDataTab);

                if (eTab && id === eTab.id) {
                    return eTab;
                } else {
                    throw {
                        name: 'Данные вкладки не прошли валидацию'
                    };
                }
            })
            .catch(this._failure);
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
    // открытие окна/вкладки
    // ################################################

    /**
     * Открытие окна браузера
     * @param {object} storedKit
     * @return {Promise}
     */
    createKit(storedKit) {
        const params = this._storedKitToOpen(storedKit);
        let timer;

        return new Promise((resolve, reject) => {
            timer = setTimeout(reject, this._TIME_OUT_HUNG);
            window.chrome.windows.create(params, resolve);
        })
            .then(eData => {
                clearTimeout(timer);
                const eKit = this._kitTask(eData);

                if (eKit && eKit.tabs.length) {
                    return eKit;
                } else {
                    throw {
                        name: 'Данные окна не прошли валидацию'
                    };
                }
            })
            .catch(this._failure);
    },


    // ################################################
    // подписка на события (пока в файле browserEvent.js)
    // ################################################







    // ################################################
    // конвертация данных, полученных от api
    // ################################################

    /**
     * Конвертация объекта, возвращенного событием браузерного api в программный
     * который будет использоватся дальше
     * {
     *      id:             {number}    id окна
     *      width:          {number}
     *      height:         {number}
     *      left:           {number}
     *      top:            {number}
     *      alwaysOnTop:    {boolean}
     *      focused:        {boolean}
     *      type:           {string}
     * }
     *
     * @param {object} eData
     * @return {object|null}
     * @private
     */
    _kitConv(eData) {
        return this._app.kitConv.validateEvent(
                this._app.kitConv.normalize({
                    id: eData.id,
                    focused: eData.focused,
                    left: eData.left,
                    top: eData.top,
                    width: eData.width,
                    height: eData.height,
                    state: eData.state,    // "fullscreen" "minimized" "maximized" "normal"
                    type: eData.type,
                    alwaysOnTop: eData.alwaysOnTop
                })
            ) || null;
        // todo сделать логирование ошибок валидации
    },

    ///**
    // * Конвертация данных объекта события вкладки. Получаем данные окна
    // * @param {*} eDataTab
    // * @return {object|null}
    // * @private
    // */
    //_eDataTabToEKit(eDataTab) {
    //    return this._app.kitConv.validateEvent(
    //            this._app.kitConv.normalize({
    //                id: eDataTab.windowId
    //            })
    //        ) || null;
    //    // todo сделать логирование ошибок валидации
    //},




    /**
     * Конвертация массива вкладок
     * @param {Array} eDataTabs
     * @return {Array}
     * @private
     */
    _tabsConv(eDataTabs) {
        return eDataTabs
            .map(eDataTab => eDataTab && typeof eDataTab === 'object' && this._tabConv(eDataTab)).filter(t=>t);
    },

    /**
     * Конвертация данных вкладки
     *  {
     *      active:
     *      url:
     *      title:
     *      favIconUrl:
     *  }
     *
     * @param {object} eData
     * @return {object|null}
     * @private
     */
    _tabConv(eData) {
        return this._app.tabConv.validateEvent(
                this._app.tabConv.normalize({
                    id: eData.id,
                    //active: eData.active,
                    //audible: eData.audible,
                    favIconUrl: eData.favIconUrl,
                    //highlighted: eData.highlighted,
                    //incognito: eData.incognito,
                    //index: eData.index,
                    //pinned: eData.pinned,
                    //selected: eData.selected,
                    //status: eData.status,
                    title: eData.title,
                    url: eData.url,
                    windowId: eData.windowId
                })
            ) || null;
        // todo сделать логирование ошибок валидации
    },







    // ################################################
    // конвертация данных для api
    // ################################################

    /**
     * Подготовка параметров открытия окна браузера
     * @param {object} storedKit
     * @return {object}
     * @private
     */
    _storedKitToOpen(storedKit) {
        const params = {
            url: storedKit.tabs.map(tab => tab.url)
        };
        switch (storedKit.state) {
            case 'minimized':
            case 'maximized':
            case 'fullscreen':
                params.state = storedKit.state;
                break;
            default:
                storedKit.left || (params.left = storedKit.left);
                storedKit.top || (params.top = storedKit.top);
                storedKit.width || (params.width = storedKit.width);
                storedKit.height || (params.height = storedKit.height);
                break
        }
        return params;
    }

};
