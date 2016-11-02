/**
 * @type {app.mapping} сопоставление вкладок сохраненного окна с реально открытым
 */
app.mapping = {
    // <debug>
    $className: 'app.mapping',

    /**
     * @type {object} the application object
     */
    _app: null,
    // </debug>

    /**
     *
     */
    init() {
        this._app.binding(this);
    },

    /**
     * Поиск записи в store
     * @param {object} kit
     * @return {Promise.<T>}
     *
     * возвращаемый объект
     * {
     *      relevant: 0 .. 1,       // идентичность
     *      view: {object}
     *      itemKey: {string},
     *      model: {object}
     *  }
     */
    model(kit) {
        return Promise.all([
                this._app.browserApi.windows.get(kit.getId()),  // получение view вкладок окна
                this._app.storeOpen.ready()                     // ожидаем готовности store
            ])
            .then(data => {
                const view = data[0];



                // Поиск наилучшего совпадения в куче записей store
                let mapping = this._app.storeOpen.getHeap()
                    .reduce((mapping, dtoRecord)=> {
                        const result = this.compare(view.tabs, dtoRecord.dtoKitTabModel.tabs);



                        if (result.relevant && (!mapping || result.relevant > mapping.relevant)) {
                            mapping = result;
                            mapping.dtoRecord = dtoRecord;
                        }
                        return mapping;
                    }, null);


                //console.log ('mapping', kit.getId(), mapping);

                // объект ответа
                const result = {
                    view
                };

                // соответствующая запись найдена
                if (mapping) {
                    result.dtoKitTabModel = mapping.dtoRecord.dtoKitTabModel;
                    result.itemKey = mapping.dtoRecord.itemKey;
                    result.relevant = mapping.relevant;

                    this._app.storeOpen.heapExclude(mapping.dtoRecord.itemKey);

                    // объединить с model все вкладки
                    mapping.equalTabs.forEach(item => {
                        this._app.tabCollect
                            .getByView(item.tabV)
                            .joinModel(item.tabM);
                    });
                }
                // окно не было сохранено ранее, создаем новую запись
                else {
                    //console.log ('not found ', result, mapping);

                    result.itemKey = this._app.storeOpen.createModel();
                    result.relevant = 0;
                }

           //     console.log ('99 ', this._app.storeOpen.getHeap());

                return result;
            })
            .catch(e => {
                console.error('--', e);

            });
    },



    /**
     * Вычисление соответствия двух наборов вкладок
     * Сравнение по url
     * @param {Array} tabsView вкладки браузера
     * @param {Array} tabsModel сохраненные данные
     * @return {object} объект соответствия
     *
     *  {
     *      relevant: {number}      // 0 ... 1 релевантность двух наборов вкладок
     *      pairTabs: {Array}       // массив пар вкладок
     *
     *  }
     *
     * @private
     */
    compare(tabsView, tabsModel) {
        const match = this._compareTask(tabsView, tabsModel);
        match.relevant = 0;                         // соответствие от 0 ... 1
        match.equal = match.equalTabs.length;       // общее количество успешно сопоставленных вкладок

        // решение о совпадении
        if (match.equal > match.length / 2) {
            if (match.lengthView === match.lengthModel) {
                match.relevant = match.host ? 0.9 : 1;
            } else {
                match.relevant = 0.9;
            }
        }

        return {
            relevant: match.relevant,
            equalTabs: match.equalTabs
        };
    },

    /**
     * Вычисление соответствия двух наборов вкладок
     * Сравнение по url
     * Пропускать записи, у которых есть closed = true
     * @param {Array} _tabsView вкладки браузера
     * @param {Array} _tabsModel сохраненные данные
     * @return {object} соответствие - 1 полное соответствие 0 - ничего не совпадает
     * @private
     */
    _compareTask(_tabsView, _tabsModel) {
        let tabsView = _tabsView.slice();
        let tabsModel = _tabsModel.slice();

        const match = {
            length     : Math.min(tabsView.length, tabsModel.length),
            lengthView : tabsView.length,
            lengthModel: tabsModel.length,

            full: 0,
            host: 0,

            /**
             * пары вкладок
             */
            equalTabs: []
        };

        // находим вкладки с полностью идентичными url
        tabsView.filter(tabV => {
                return !tabsModel.some((tabM, index) => {

                    return this._matchFull(tabV, tabM) ?
                        (tabsModel.splice(index, 1), ++match.full, match.equalTabs.push({
                            tabV,
                            tabM
                        })) :
                        false;
                });
            })

            // вкладки с совпадающим host
            .filter(tabV => {
                return !tabsModel.some((tabM, index) => {

                    return this._matchHost(tabV, tabM) ?
                        (tabsModel.splice(index, 1), ++match.host, match.equalTabs.push({
                            tabV,
                            tabM
                        })) :
                        false;
                });
            });

        //console.log(match);
        //console.log('left:: ', _tabsView);
        //console.log('right:: ', _tabsModel);

        return match;
    },

    /**
     * Полное соовпадение вкладок (сравнение по url)
     * @param {object} tabLeft
     * @param {object} tabRight
     * @returns {boolean}
     * @private
     */
    _matchFull(tabLeft, tabRight) {
        // console.log (tabLeft.url === tabRight.url,  tabLeft.url + '   -----   ' + tabRight.url);
        return tabLeft.url === tabRight.url;
    },

    /**
     * Частичное соовпадение вкладок (сравнение по host)
     * todo пока просто первые символы - не менее 12 символов считаем совпадением
     * потом сделать нормальный парсинг url
     * @param {object} tabLeft
     * @param {object} tabRight
     * @returns {boolean}
     * @private
     */
    _matchHost(tabLeft, tabRight) {
        let i, compare = true;
        for (i = 0; i <= 12; i++) {
            if (tabLeft.url[i] !== tabRight.url[i]) {
                compare = false;
                break;
            }
        }
        //console.log (compare, tabLeft.url + '   <---->   ' + tabRight.url);
        return compare;
    }

};
