/**
 *
 * @param {{  }} props
 * @return app.cmp.TabCreateBlank
 */
app.cmp.tabCreateBlank = function(props) {



};

/**
 * @param {{  }} props
 * @constructor
 */
app.cmp.TabCreateBlank = function(props) {

};

/**
 *
 */
app.cmp.TabCreateBlank.prototype = {

};












/**
 * Кнопка открыть пустое окно
 *
 *
 */
app.addCmp('tab-create-blank', {
    // <debug>
    /**
     * @type {app} the application object
     */
    _app: null,
    // </debug>

    /**
     * @type {object} dom элемент поля ввода
     */
    _elButton: null,

    /**
     *
     */
    init() {
        this._app.binding(this);

        this._elButton = document.querySelector('.tab-create-blank__create');
        this._elButton.addEventListener('click', this.create);
    },

    /**
     * Сохранение изменений
     */
    create() {
        return this._app.msg('tab.blank.create', {})
            .then(data => {
            })
            .catch(e => console.warn('tab.blank.create catch', e))
    }

});
