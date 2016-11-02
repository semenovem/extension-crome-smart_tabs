/**
 * Кнопки для окна
 * ОС mac
 *
 *
 */
app.addCmp('kit-action-mac', {
    // <debug>
    /**
     * @type {app} the application object
     */
    _app: null,
    // </debug>

    /**
     * шаблон компонента
     */
    _html: `
        <div class="kit-action-mac">
            <div class="kit-action-mac__close"></div>
            <div class="kit-action-mac__collapse"></div>
            <div class="kit-action-mac__expand"></div>
        </div>
    `,

    /**
     * Создание экземпляра компонента
     *
     *
     * @param {object} props
     * @return {object}
     */
    createInstance(props) {
        const instance = Object.create(this);
        instance._name = props.name;
        instance._kitId = props.kitId;

        instance.active = this.active.bind(instance);
        instance.deactive = this.deactive.bind(instance);
        instance.use = this.use.bind(instance);

        // dom
        const el = instance._el = this._app.util.htmlToEl(this._html);

        // buttons
        instance._elBtnClose = el.querySelector('.kit-action-mac__close');
        instance._elBtnCollapse = el.querySelector('.kit-action-mac__collapse');
        instance._elBtnExpand = el.querySelector('.kit-action-mac__expand');

        // handlers
        instance._elBtnClose.addEventListener('click', props.close);
        instance._elBtnCollapse.addEventListener('click', props.collapse);
        instance._elBtnExpand.addEventListener('click', props.expand);

        // use
        instance.use(props);

        props.elRoot && props.elRoot.appendChild(instance._el);

        return instance;
    },

    /**
     * Установить состояние кнопкам
     * @param {object} props
     */
    use(props) {
        this._elBtnClose.classList[props.closeUse ? 'add' : 'remove']('kit-action-mac__close_use');
        this._elBtnCollapse.classList[props.collapseUse ? 'add' : 'remove']('kit-action-mac__collapse_use');
        this._elBtnExpand.classList[props.expandUse ? 'add' : 'remove']('kit-action-mac__expand_use');
    },

    /**
     *
     */
    active() {
        this._el.classList.add('kit-action-mac_active');
    },

    /**
     *
     */
    deactive() {
        this._el.classList.remove('kit-action-mac_active');
    },

    /**
     * Удаление компонента
     */
    destroy() {
        this._el.remove();

        for (const key in this) {
            this.hasOwnProperty(key) && delete this[key];
        }
    }

});
