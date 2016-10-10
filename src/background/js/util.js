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

    /**
     * Рекурсивное объединение всех свойств двух объектов в новый объект
     *
     * @param {object} target
     * @param {object} source
     * @return {object} возвращает новый объект
     */
    objectMerge(target, source) {
        const result = target && typeof target === 'object' ? Object.assign({}, target) : {};
        let key;

        for (key in source) {
            if (!source.hasOwnProperty(key)) {
                continue;
            }
            if (source[key] && typeof source[key] === 'object') {
                result[key] = this.objectMerge(result[key], source[key]);

            } else {
                result[key] = source[key];
            }
        }
        return result;
    }




};



