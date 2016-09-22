/**
 * Сравнение двух массивов вкладок
 * @type {object}
 */
app.matchTab = {
    // <debug>
    $className: 'Util',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Вычисление соответствия двух наборов вкладок
     * Сравнение по url
     * Пропускать записи, у которых есть closed = true
     * @param {Array} arr0 первый набор вкладок - вкладки браузера
     * @param {Array} arr1 второй набор - сохраненные вкладки
     * @return {object} соответствие - 1 полное соответствие 0 - ничего не совпадает
     * @private
     */
    compare(arr0, arr1) {

        const match = this._compare(arr0, arr1);

        match.ratio = 0;    // соответствие от 0 ... 1

        match.compare = match.full + match.host;    // все вкладки (left || right) определены


        // решение о совпадении
        if (match.compare === match.length) {
            match.ratio = 1;
        }

        return match.ratio;
    },





    /**
     * Вычисление соответствия двух наборов вкладок
     * Сравнение по url
     * Пропускать записи, у которых есть closed = true
     * @param {Array} tabsLeft первый набор вкладок
     * @param {Array} tabsRight второй набор
     * @return {object} соответствие - 1 полное соответствие 0 - ничего не совпадает
     * @private
     */
    _compare(tabsLeft, tabsRight) {
        let left = this._getOpenTabs(tabsLeft);
        let right = this._getOpenTabs(tabsRight);

        const match = {
            length: Math.min(left.length, right.length),
            lengthLeft: left.length,
            lengthRight: right.length,

            full: 0,
            host: 0
        };

        // находим вкладки с полностью идентичными url
        left = left.filter(tabLeft => {
                return !right.some((tabRight, index) => {
                    return this._matchFull(tabLeft, tabRight) ?
                        (right.splice(index, 1), ++match.full) :
                        false;
                });
            })

            // вкладки с совпадающим host
            .filter(tabLeft => {
                return !right.some((tabRight, index) => {
                    return this._matchHost(tabLeft, tabRight) ?
                        (right.splice(index, 1), ++match.host) :
                        false;
                });
            });

        //console.log(match);
        //
        //console.log('left:: ', left)
        //console.log('right:: ', right)


        return match;
    },





        /**
     * Получить массив без закрытых вкладок
     * @param {Array} tabs массив вкладок
     * @return {Array}
     * @private
     */
    _getOpenTabs(tabs) {
        return tabs.filter(tab => !tab.closed);
    },

    /**
     * Полное соовпадение вкладок (сравнение по url)
     * @param {object} tabLeft
     * @param {object} tabRight
     * @returns {boolean}
     * @private
     */
    _matchFull(tabLeft, tabRight) {
        //console.log (tabLeft.url === tabRight.url, '  ', tabLeft.url, '   -----   ', tabRight.url);
        return tabLeft.url === tabRight.url;
    },


    /**
     * Частичное соовпадение вкладок (сравнение по host)
     * todo пока просто первые сиволы - не менее 12 символов считаем совпадением
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
        //console.log (compare, '   ', tabLeft.url, '   -----   ', tabRight.url);
        return compare;
    }






};