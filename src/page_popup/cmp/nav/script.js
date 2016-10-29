/**
 * Навигация на странице
 *
 *
 */
app.addCmp('nav', {
    // <debug>
    /**
     * @type {object} объект приложения
     */
    _app: null,
    // </debug>


    /**
     * Создание экземпляра компонента
     * todo потом отрефакторить этот метод
     *
     *
     * @param {object} props
     * @return {object}
     */
    createInstance(props) {
        const instance = Object.create(this);

        instance._rootSetMode = props.setMode;
        instance._rootGetMode = props.getMode;

        const el = instance._el = document.querySelector('.nav');

        el.querySelector('.nav__item-main').addEventListener('click', this.setMode.bind(instance, 'main'));
        el.querySelector('.nav__item-setup').addEventListener('click', this.setMode.bind(instance, 'setup'));


        // отметить выбранный пункт меню
        switch (props.getMode()) {
            case 'main':
                el.querySelector('.nav__item-main').classList.add('nav__item_current');
                break;
            case 'setup':
                el.querySelector('.nav__item-setup').classList.add('nav__item_current');
                break;
        }

        return instance;
    },

    /**
     * Изменение режима работы
     *
     * @param {String} mode
     * @param {Event} e
     */
    setMode(mode, e) {
        Array.prototype.forEach
            .call(this._el.querySelectorAll(
                '.nav__item_current'),
                el => el.classList.remove('nav__item_current')
            );

        e.target.classList.add('nav__item_current');

        this._rootSetMode(mode);
    }
});
