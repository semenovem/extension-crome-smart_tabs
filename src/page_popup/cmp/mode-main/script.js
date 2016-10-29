/**
 * Режим основной
 *
 *
 */
app.addCmp('mode-main', {
    // <debug>
    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * @type {Object} компонент открытых окон open-kits
     */
    _cmpOpenKits: null,

    /**
     * @type {Object} компонент недавно закрытых окон recent-kits
     */
    _cmpRecentKits: null,
    // </debug>

    _html: `
        <div class="mode-main">
            <div class="mode-main__open-kits"></div>
            <div class="mode-main__recent-kits"></div>
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

        const el = instance._el = this._app.util.htmlToEl(this._html);

        // открытые окна
        this._cmpOpenKits = this._app.createCmp('open-kits', {
            elRoot: el.querySelector('.mode-main__open-kits')
        });

        props.elRoot && props.elRoot.appendChild(instance._el);

        return instance;
    },

    /**
     * Скрыть
     */
    hide() {
        this._el.style.display = 'none';
    },

    /**
     * Показать
     */
    show() {
        this._el.style.display = null;
    }
});
