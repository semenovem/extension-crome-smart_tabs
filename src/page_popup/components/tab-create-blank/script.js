/**
 * Кнопка открыть пустое окно
 *
 *
 */
app.addCmp('tab-create-blank', {
    // <debug>
    /**
     * Объект приложения
     * @type {object}
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
        return this._app.msg('tab.create.blank', {})
            .then(data => {
            })
            .catch(e => console.warn('tab.create.blank catch', e))
    }

});
