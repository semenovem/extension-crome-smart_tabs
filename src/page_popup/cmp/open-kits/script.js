/**
 * Открытые окна
 *
 * @component
 *
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

    /**
     * @type {object} dom элемент, в который помещаются компоненты kit-preview
     */
    _elContainer: null,

    /**
     * Явное указание контекста методам
     * Получение данных об открытых окнах
     * Создание превью всех открытых окон
     *
     */
    init() {
        this._app.binding(this);
        this._elContainer = document.querySelector('.open-kits__container');

        this._app.msg('open.kits.get')
            .then(this._createAllKitPreview)
            .catch(e => console.warn(e));
    },

    /**
     * Создать превью всех окон
     * разместить в dom
     *
     * @param kitsProps
     * @private
     */
    _createAllKitPreview(kitsProps) {
        console.log (kitsProps);

        const cmpKitPreview = this._app.getCmp('kit-preview');


        // создание компонентов превью окон
        this._previewAllKits = kitsProps
            .map(props => cmpKitPreview.create(props));

        this._previewAllKits
            .forEach(previewKit => this._elContainer.appendChild(previewKit.getEl()));
    }


});
