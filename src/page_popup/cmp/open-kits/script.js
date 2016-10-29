/**
 * Открытые окна
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

    _html: `
        <div class="open-kits">
            <div class="open-kits__title">Открытые окна</div>
            <div class="open-kits__preview"></div>
        </div>
    `,

    /**
     * Создание экземпляра компонента
     *
     * @param {object} props
     * @return {object}
     */
    createInstance(props) {
        const instance = Object.create(this);
        instance._el = this._app.util.htmlToEl(this._html);
        instance._elPreview = instance._el.querySelector('.open-kits__preview');

        this._app.msg('open.kits.get')
            .then(this._createAllKitPreview.bind(instance))
            .catch(e => console.warn(e));

        props.elRoot && props.elRoot.appendChild(instance._el);

        return instance;
    },

    /**
     * Создать превью открытых окон
     *
     * @param kitsProps
     * @private
     */
    _createAllKitPreview(kitsProps) {
        kitsProps.map(props => this._app.createCmp(
            'kit-preview',
            Object.assign(props, { elRoot: this._elPreview })
        ));
    }
});
