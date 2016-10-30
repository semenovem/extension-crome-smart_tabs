/**
 * @type {object} data transport object
 */
app.dto = {
    // <debug>
    $className: 'app.dto',

    /**
     * @type {object} the application object
     */
    _app: null,
    // </debug>

    /**
     * @type {Array} Список состояний окна
     */
    _kitStateOptions: [
        'fullscreen',
        'minimized',
        'maximized',
        'normal'
    ],

    /**
     * @type {String} the state kit by default
     */
    kitStateDefault: 'normal',

    /**
     *
     */
    init() {
        this._app.binding(this);
        //  устновить прототипы для dto
    },

    /**
     * число, >= 0
     * @param {*} val
     * @return {boolean}
     */
    notNegative(val) {
        return isFinite(val) && val >= 0;
    },

    /**
     * Число
     * @param {*} val
     * @return {boolean}
     */
    moreZero(val) {
        return isFinite(val) && val > 0;
    },

    /**
     * Состояние окна браузера
     * @param {*} state
     * @return {boolean}
     */
    kitState(state) {
        return this._kitStateOptions.indexOf(state) !== -1;
    }

};
