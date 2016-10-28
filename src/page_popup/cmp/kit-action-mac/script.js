/**
 * Кнопки для окна
 * mac
 *
 *
 */
app.addCmp('kit-action-mac', {
    // <debug>
    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>


    /**
     * шаблон компонента
     */
    _TEMPLATE: `
        <div class="kit-action-mac">
            <div class="kit-action-mac__close"></div>
            <div class="kit-action-mac__collapse"></div>
            <div class="kit-action-mac__expand"></div>
        </div>
    `,

    /**
     *
     */
    init() {
        this._app.binding(this);

        const elTmp = document.createElement('DIV');
        elTmp.innerHTML = this._TEMPLATE;
        this._el = elTmp.firstElementChild;

        delete this._TEMPLATE;
    },

    /**
     * Создание компонента
     *
     *
     * @param {object} params свойства
     * @return {object} dom элемент
     */
    create(params) {
        const el = this._el.cloneNode(true);

        el.querySelector('.kit-action-mac__close').addEventListener('click', params.close);
        el.querySelector('.kit-action-mac__collapse').addEventListener('click', params.collapse);
        el.querySelector('.kit-action-mac__expand').addEventListener('click', params.expand);


        return el;
    },


});
