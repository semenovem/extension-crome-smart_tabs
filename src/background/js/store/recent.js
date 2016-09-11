/**
 * @type {object} хранение недавно закрытых окон/вкладок
 */
app.store.recent = {





    /**
     * Чтение сохраненных данных недавно закрытых окон браузера
     * @returns {Promise}
     */
    readFewRawRecent() {
        return new Promise((resolve) => {
            let items;  // {Array} сохраненные данные окон браузера

            // данные есть в кеше
            if (this._cache['kits_recent']) {

                items = this._cache['kits_recent'];
            }
            // данных нет в кеше
            else {
                let data = localStorage.getItem('kits_recent');
                let arr;
                try {
                    if (data) {
                        arr = JSON.parse(data);
                    }
                    if (Array.isArray(arr)) {
                        //items = arr.map(str => this._app.itemKitModel.getRaw(str))
                        //    .filter(item => item);

                        // сохранили в кеш
                        if (items.length) {
                            this._cache.kits_recent = items;
                        }
                    }
                }
                catch (e) {
                    this._app.log.msg({
                        name: 'Получение сохраненных данных недавно закрытых окон браузера',
                        msg: 'Запись в localStorage не валидна'
                    });
                }
                finally {
                    if (!items) {
                        items = [];
                    }
                }
            }

            resolve(items);
        });
    },

    /**
     * @param {object} kit
     */
    saveRecent(kit) {
        this.readFewRawRecent()
            .then(items => {
                return items;
            });

        return new Promise((resolve, reject) => {
            let data = kit.serialization();
            if (data) {

                console.log('saveRecent', { d: data }, '\n\n\n');
                localStorage.setItem('kit_open_' + kit.id, data);
                resolve(true);
            }
            else {
                reject({
                    name: 'не удалось записать'
                });
            }
        });

    },

    /**
     * Чтение сохраненных данных давно закрытых окон браузера
     */
    readRecordsOld() {
        //return this.readKits('old');
    },



};