/**
 * Настройки
 * Получение и изменение в синхронном режиме
 */
app.setup = {
    // <debug>
    $className: 'Setup',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,

    /**
     * @type {function} @class Ready состояние готовности
     */
    ready: null,

    /**
     * Настройки
     * @type {object}
     */
    _data: null,

    // </debug>

    /**
     * Измененные записи, которые нужно сохранить
     */
    _change: [],


    /**
     * Показывает, что данные были изменены и необходимо сохранение
     */
    _isModify: false,

    /**
     * Кеширвание данных
     */
    _cache: {
        _list: {},
        has(path) {
            return path in this._list;
        },
        get(path) {
            return this._list[path];
        },
        add(path, value) {
            this._list[path] = value;
        },
        reset() {
            this._list = {};
        }
    },


    /**
     *
     */
    init() {
        this._app.binding(this);
        this.ready = this._app.Ready();
    },

    /**
     * Подготовка. Получить
     * - настройки по умолчанию
     * - пользовательские, сохраненные в store
     * объединяет их в один объект
     *
     * @return {Promise}
     */
    prep() {
        return Promise.all([
            this._app.storeSetup.get(),
            this._readFileSetup()
        ])
            .then(results => {
                this._data = this._app.util.objectMerge(results[0], results[1]);
                this.ready.resolve();
            });
    },

    /**
     * Чтение настроек по умолчанию из файла
     * @returns {Promise.<T>}
     * @private
     */
    _readFileSetup() {
        return fetch ('background_setting.json')
            .then(response => response.json())
            .catch(e => {
                console.warn('Не удалось прочитать настройки по умолчанию', e);
                throw e;
            });
    },

    /**
     * Получение значения. Сначала проверяем в сохранения в кеше, если нет, получаем из БД
     * @param {string} path
     * @return {*}
     */
    get(path) {
        return this._cache.has(path) ? this._cache.get(path) : this._get(path);
    },


    /**
     * Получение значения
     * @param {string} path
     * @return {*}
     */
    _get(path) {
        const chainProps = path.split('.');
        const goal = chainProps[chainProps.length - 1];
        let value;
        let exist;

        let data = this._data;

        chainProps.every(link => {

            if (data && typeof data === 'object' && goal in data) {
                value = data[goal];
                exist = true;
            }

            return data = data[link];
        });

        if (exist) {
            this._cache.add(path, value);
            return value;
        }

        this._app.log({
            e: new Error,
            name: 'не смогли найти запрошенное свойство: ' + path
        });
    },




    /**
     * Изменение значения. Асинхронно
     * @param {string} name
     * @param {*} value
     */
    set(name, value) {
        // сделать запись во вложенные объекты типа 'prop.ext.one'
        // todo сделать асинхронную запись
        this._data[name] = value;
        this._change.push({
            name: name,
            value: value
        });
        this._isModify = true;
    }
};
