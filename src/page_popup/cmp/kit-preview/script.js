/**
 * @param {{  }} props
 * @constructor
 */
app.cmp.KitPreview = function(props) {

};

/**
 *
 */
app.cmp.KitPreview.prototype = {

};








/**
 * Превью окна
 *
 *
 */
app.addCmp('kit-preview', {
    // <debug>
    /**
     * @type {app} the application object
     */
    _app: null,

    /**
     * @type {object} компонент класса kit-name
     * сохраняется в экземпляр компонента
     */
    _cmpName: null,

    /**
     * @type {object} компонет класса kit-action-mac || kit-action-windows
     * сохраняется в экземпляр компонента
     */
    _cmpAction: null,
    // </debug>

    /**
     * Кол-во активностей на компоненте
     * Компонент становится активным:
     * при наведении мышкой
     * если активен один из дочерних компонентов
     */
    _activity: 0,

    /**
     * шаблон компонента
     */
    _html: `
        <div class="kit-preview">
            <div class="kit-preview__action"></div>
            <div class="kit-preview__name"></div>
            <div class="kit-preview__tab-icon"></div>
        </div>
    `,

    /**
     * Создание компонента
     *
     * Если окно текущее - установить класс css kit-review_current
     * Присвоить имя окна
     * Создать дочерние компоненты: kit-action,
     * Установить обработчики:
     * на кнопки action
     * на изменение названия окна
     *
     * @param {object} props
     * @return {object}
     */
    createInstance(props) {
        const instance = Object.create(this);
        const el = instance._el = this._app.util.htmlToEl(this._html);

        instance.active = this.active.bind(instance);
        instance.deactive = this.deactive.bind(instance);
        instance._kitId = props.id;
        instance._state = props.state;

        // кнопки
        instance._cmpAction = this._app.createCmp('kit-action-mac', {
            elRoot: el.querySelector('.kit-preview__action'),
            kitId : props.id,

            close   : this.close.bind(instance),
            closeUse: true,

            collapse   : this.collapse.bind(instance),
            collapseUse: props.state !== 'minimized',

            expand   : this.expand.bind(instance),
            expandUse: props.state === 'minimized'
        });

        // название окна
        instance._cmpName = this._app.createCmp('kit-name', {
            elRoot  : el.querySelector('.kit-preview__name'),
            name    : props.name,
            kitId   : props.id,
            active  : instance.active,
            deactive: instance.deactive
        });

        //
        if (props.id === this._app.getKitId()) {
            instance._el.classList.add('kit-preview_current');
            instance.active();
        } else {
            el.addEventListener('mouseenter', instance.active);
            el.addEventListener('mouseleave', instance.deactive);
        }

        props.elRoot && props.elRoot.appendChild(instance._el);

        return instance;
    },

    /**
     * Компонент активен
     */
    active() {
        this._activity || this._cmpAction.active();
        this._activity++;
    },

    /**
     * Компонент не активен
     */
    deactive() {
        this._activity--;
        if (!this._activity) {
            this._cmpAction.deactive();
        }
    },

    /**
     * Закрыть окно браузера
     * @return {Promise.<T>}
     */
    close() {
        this._el.classList.add('kit-preview_closed');
        if (!this._isClosed) {
            this._isClosed = true;
        }

        return this._app.msg('kit.remove', {
                kitId: this._kitId
            })
            .then(() => new Promise(fn => setTimeout(fn, 200)))
            .then(this.destroy.bind(this))
            .catch(e => console.warn(e));
    },

    /**
     * Свернуть окно браузера
     * @return {Promise.<>}
     */
    collapse() {
        if (this._state === 'minimized') {
            return Promise.resolve();
        }
        return this._app.msg('kit.state.minimized', {
                kitId: this._kitId
            })
            .then(data => {
                this._state = data.stateNew;
                this._cmpAction.use({
                    closeUse   : true,
                    collapseUse: false,
                    expandUse  : true
                });
            })
            .catch(e => console.warn(e));
    },

    /**
     * Развернуть окно браузера
     * @return {Promise.<>}
     */
    expand() {
        if (this._state !== 'minimized') {
            return Promise.resolve();
        }
        return this._app.msg('kit.state.normal', {
                kitId: this._kitId
            })
            .then(data => {
                this._state = data.stateNew;
                this._cmpAction.use({
                    closeUse   : true,
                    collapseUse: true,
                    expandUse  : false
                });

                // здесь возвращаем фокус текущему окну,
                // поскольку при разворачивании окна другого окна, фокус переходит к нему
                return this._app.msg('kit.focused.set', {
                    kitId  : this._app.getKitId(),
                    focused: true
                })
            })
            .catch(e => console.warn(e));
    },

    /**
     * Удаление компонента
     */
    destroy() {
        this._cmpAction.destroy();
        this._cmpName.destroy();

        this._el.remove();

        for (const key in this) {
            this.hasOwnProperty(key) && delete this[key];
        }
    }

});
