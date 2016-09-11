/**
 *
 * @class app.Util
 */
app.util = {
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
     * @returns {object} соответствие - 1 полное соответствие 0 - ничего не совпадает
     * @private
     */
    compareTabs(arr0, arr1) {
        const similar = {
            tabs0: arr0.length,
            tabs1: arr1.filter(tab => !tab.closed).length,
            closed1: 0,
            match: false,
            equal: 0,
            different: 0
        };
        similar.closed1 = arr1.length - similar.tabs1;

        // копии исходных массивов
     //   let tabs0;
        let tabs1 = arr1.slice();

        // <debug>
        let i = false;
        //        i && (this._trace = '......................................................\n');
        // </debug>

        // Итерация первого массива
        arr0.filter(tab0 => {

            // Итерация копии второго массива
            let found = tabs1.some((tab1, ind) => {
                let found = this._compareTab(tab0, tab1);
                if (found) {
                    tabs1.splice(ind, 1);   // удалить найденный элемент
                }
                return found;
            });

            if (found) {
                similar.equal++;
            }
            return !found;
        });

        similar.different = Math.max(similar.tabs0, similar.tabs1) - similar.equal;

        // полное соответствие
        if (!similar.different) {
            similar.match = true;
        }


        // <debug>
        else {
            //      i && console.log (this._trace);
            i && console.log('......................................................', similar);
        }
        // </debug>

        return similar;
    },

    /**
     * Сравнение 2-х вкладок
     * @param tab0
     * @param tab1
     * @private
     */
    _compareTab(tab0, tab1) {

        // <debug>
        //    this._trace += (tab0.url === tab1.url) + '' + ' \n';
        //    this._trace += tab0.url + '\n';
        //    this._trace += tab1.url + '\n\n';
        // </debug>

        return tab0.url === tab1.url;
    }

};



