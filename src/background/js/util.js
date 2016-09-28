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

    init() {
        this._app.binding(this);
    },


    /**
     * Получить значение, вложенное в другие объекты
     * @example получим html, из объекта такой структуры: players.noautoplay.html
     *
     * @param {string} props строка вида "players.noautoplay.html" - путь к значению в объекте
     * @param {object} obj объект, из которого достаем данные
     * @return {{value: *, exist: boolean}} полученное значение и инфо - доступно ли свойство
     */
    getDeepProp(props, obj) {
        let exist = true;
        const value = props.split('.')
            .reduce((obj, key) => {
                let result = false;
                if (obj && typeof obj === 'object') {
                    result = key in obj ? obj[key] : exist = false;
                }
                return result;
            }, obj);

        return {
            value: value,
            exist: exist
        };
    },




};



