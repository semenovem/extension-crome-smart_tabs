/**
 * Название текущего окна
 *
 *
 */
app.addCmp('open-kits', {
    // <debug>
    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    ///**
    // * @type {object} dom элемент поля ввода
    // */
    //_elInput: null,

    /**
     * Явное указание контекста методам
     * Получение данных об открытых окнах
     *
     */
    init() {
        this._app.binding(this);

        console.log ('open-kits init');




        this._app.msg('open.kits.get')
            .then(data => {
                console.log (data);
            })
            .catch(e => console.warn(e));


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



});
