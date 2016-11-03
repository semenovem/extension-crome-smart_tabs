/**
 * @param {{ elRoot }} props
 * @param {Object} app
 * @constructor
 */
app.cmp.OpenKits = function(props, app) {
    this._el = app.util.htmlToEl(this._html);
    this._elPreview = this._el.querySelector('.open-kits__preview');

    app.msg('open.kits.get')
        .then(kitsProps => {

            kitsProps.map(props => app.createCmp(
                'kit-preview',
                Object.assign(props, { elRoot: this._elPreview })
            ));

        })
        .catch(e => console.warn(e));


    props.elRoot && props.elRoot.appendChild(this._el);
};

/**
 *
 */
app.cmp.OpenKits.prototype = {
    /**
     * @type String
     */
    _html: `
        <div class="open-kits">
            <div class="open-kits__title">Открытые окна</div>
            <div class="open-kits__preview"></div>
        </div>
    `
};
