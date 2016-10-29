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

    _kitStateOptions: [
        'fullscreen',
        'minimized',
        'maximized',
        'normal'
    ],

    init() {
        this._app.binding(this);
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
    positive(val) {
        return isFinite(val) && val >= 0;
    },

    /**
     * Состояние окна браузера
     * @param {*} state
     * @return {boolean}
     */
    kitState(state) {
        return this._kitStateOptions.indexOf(state) !== -1;

    },




};
