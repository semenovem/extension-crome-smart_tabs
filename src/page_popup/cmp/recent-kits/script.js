/**
 *
 * @param {{  }} props
 * @return app.cmp.RecentKits
 */
app.cmp.recentKits = function(props) {



};

/**
 * @param {{  }} props
 * @constructor
 */
app.cmp.RecentKits = function(props) {

};

/**
 *
 */
app.cmp.RecentKits.prototype = {

};













/**
 * Недавно закрытые окна
 *
 *
 */
app.addCmp('recent-kits', {
    // <debug>
    /**
     * @type {app} the application object
     */
    _app: null,
    // </debug>

    _html: `
        <div class="recent-kits">
            <div class="recent-kits__title">Недавно закрытые окна</div>
            <div class="recent-kits__preview"></div>
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
        instance._elPreview = instance._el.querySelector('.recent-kits__preview');

        this._app.msg('recent.kits.get')
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
