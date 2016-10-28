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

    ///**
    // * @type {object} dom элемент поля ввода
    // */
    //_elInput: null,

    /**
     * шаблон компонента
     */
    _TEMPLATE: `
        <div class="kit-preview">
            <div class="kit-preview__action"></div>
            <div class="kit-preview__name">
                <input class="kit-preview__name-field">
            </div>
            <div class="kit-preview__tab-icon"></div>
        </div>
    `,

    /**
     *
     */
    init() {
     //   this._app.binding(this);


        const elTmp = document.createElement('DIV');
        elTmp.innerHTML = this._TEMPLATE;
        this._el = elTmp.firstElementChild;

        delete this._TEMPLATE;
    },

    /**
     * Создание компонента
     * Если окно текущее - установить класс css kit-review_current
     * Присвоить имя окна
     * Создать дочерние компоненты: kit-action,
     * Установить обработчики:
     * на кнопки action
     * на изменение названия окна
     *
     *
     * @param {object} props свойства окна: model + дополнительные свойства
     * @return {object} объект компонента
     */
    create(props) {
        const cmp = Object.create(this);
        cmp._el = this._el.cloneNode(true);

        if (props.id === this._app.getKitId()) {
            cmp._el.classList.add('kit-preview_current');
        }

        if (props.name) {
            cmp._el.querySelector('.kit-preview__name-field').value = props.name;
        }

        cmp._el.querySelector('.kit-preview__action').appendChild(
            this._app.getCmp('kit-action-mac').create({
                close: this.close.bind(cmp),
                collapse: this.collapse.bind(cmp),
                expand: this.expand.bind(cmp)
            })
        );

        cmp._id = props.id;

        console.log(props);

        return cmp;
    },






    /**
     * Получить dom элемент компонента
      * @return {*}
     */
    getEl() {
        return this._el;
    },








    //
    close() {
        console.log ('close', this._id);
        this._el.classList.add('kit-preview_closed');
    },

    //
    collapse() {
       console.log ('collapse', this._id);
    },

    //
    expand() {
        console.log ('expand', this._id);
    }





});
