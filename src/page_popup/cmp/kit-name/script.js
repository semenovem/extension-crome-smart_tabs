/**
 * Название окна
 *
 *
 */
app.addCmp('kit-name', {
    // <debug>
    /**
     * @type {app} the application object
     */
    _app: null,
    // </debug>

    /**
     * @type {string} html шаблон компонента
     */
    _html: `
        <div class="kit-name">
            <input class="kit-name__field">
        </div>
    `,

    /**
     * Создание экземпляра компонента
     *
     * ставим обработчик на получение фокуса
     * обработчки на изменение поля и запись поставим после получения фокуса элементом
     *
     *
     * @param {object} props
     * @return {object}
     */
    createInstance(props) {
        const instance = Object.create(this);
        instance._name = props.name;
        instance._kitId = props.kitId;
        instance._rootActive = props.active;
        instance._rootDeactive = props.deactive;

        instance.active = this.active.bind(instance);
        instance.deactive = this.deactive.bind(instance);

        // dom
        instance._el = this._app.util.htmlToEl(this._html);
        instance._elField = instance._el.querySelector('.kit-name__field');

        // события
        instance._elField.addEventListener('focus', instance.active);
        instance._elField.value = this.normalize(props.name);

        props.elRoot && props.elRoot.appendChild(instance._el);

        return instance;
    },

    /**
     * Начало обработки пользовательского ввода
     */
    active() {
        this._elField.focus();

        this.modify = Modify({
            delay   : 1000,
            callback: this.save.bind(this)
        });

        this._elField.addEventListener('blur', this.deactive);
        this._elField.addEventListener('input', this.modify);
        this._rootActive();
    },

    /**
     * Завершение пользователького ввода
     */
    deactive() {
        this._elField.removeEventListener('blur', this.deactive);
        this._elField.removeEventListener('input', this.modify);

        if (this.modify.is) {
            this.modify.run();
        }
        this.modify.destroy();
        this._rootDeactive();
    },

    /**
     * getter содержимое поля ввода
     * @return {string}
     */
    getValue() {
        return this.normalize(this._elField.value);
    },

    /**
     * Приведение значения к требуемому типу
     * @param {*} val
     * @return {string}
     */
    normalize(val) {
        return typeof val === 'string' ? val.trim() : '';
    },

    /**
     * Сохранение данных
     * @return {Promise}
     */
    save() {
        const nameNew = this.getValue();
        return nameNew !== this._name ? this._save(nameNew) : Promise.resolve();
    },

    /**
     * Сохранение изменений
     * @param {string} nameNew новое название окна
     * @return {Promise}
     */
    _save(nameNew) {
        return this._app.msg('kit.name.set', {
                name : nameNew,
                kitId: this._kitId
            })
            .then(data => this._name = data.nameNew)
            .catch(e => console.warn('kit name save msg catch', e))
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
