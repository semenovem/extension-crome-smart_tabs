/**
 * @param {{ elRoot }} props
 * @param {Object} app
 * @constructor
 */
app.cmp.ModeMain = function(props, app) {
    const el = this._el = app.util.htmlToEl(this._html);

    /**
     * @type Object компонент открытых окон open-kits
     */
    this._cmpOpenKits = new app.cmp.OpenKits(
        {
            elRoot: el.querySelector('.mode-main__open-kits')
        },
        app
    );

    /**
     * @type Object компонент недавно закрытых окон recent-kits
     */
    this._cmpRecentKits = null;

    // todo добавлять недавно закрытые окна

    props.elRoot && props.elRoot.appendChild(el);
};

/**
 * @type Object
 */
app.cmp.ModeMain.prototype = {
    /**
     * @type String
     */
    _html: `
        <div class="mode-main">
            <div class="mode-main__open-kits"></div>
            <div class="mode-main__recent-kits"></div>
        </div>
     `,

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

};
