/**
 * Превью окна
 *
 *
 */
app.addCmp('kit-preview', {
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
    _elInput: null,

    /**
     *
     */
    init() {
        this._app.binding(this);
        //
        //this.modify = Modify({
        //    delay   : 1000,
        //    callback: this.save
        //});
        //
        //// при клике на компонент передать фокус полю ввода
        //document.querySelector('.kit-name').addEventListener('click', this.active);
        //
        //// обработчикик на события поля воода
        //this._elInput = document.querySelector('.kit-name__input');
        //
        //// установить значение в поле. текущее навание окна получим из модели
        //this._elInput.value = this.normalize(this._app.getPropModel('name'));
        //
        //// обработчкики событий поля ввода
        //this._elInput.addEventListener('blur', this.modify.run);
        //this._elInput.addEventListener('input', this.modify);
    },

    /**
     * клик по компоненту
     * передать фокус полю ввода
     */
    active() {
        this._elInput.focus();
    },

    /**
     * getter содержимое поля ввода
     * @return {string}
     */
    getValue() {
        return this.normalize(this._elInput.value);
    },

    /**
     * Приведение значения к требуемому типу
     * @param {*} val
     * @return {string}
     */
    normalize(val) {
        return typeof val === 'string' ? val.trim() : '';
    },

    /**
     * Сохранение изменений
     */
    save() {
        if (!this.isChanged()) {
            return;
        }

        return this._app.msg('kit.name.save', {
                name : this.getValue(),
                kitId: this._app.getKitId()
            })
            .then(data => {
                // todo сделать валидацию ожидаемого значения

                this._app.setPropModel('name', data.body.nameNew);
            })
            .catch(e => console.warn('kit name save msg catch', e))
    },

    /**
     * Измены ли данные (нужно ли сохранять)
     * @return {boolean}
     */
    isChanged() {
        return this.normalize(this._app.getPropModel('name')) != this.getValue();
    }

});
