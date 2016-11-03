/**
 * Плашка навигации вверху страницы
 * @param {{ setMode: Function, getMode: Function }} props
 * @constructor
 */
app.cmp.Nav = function(props) {

    this._rootSetMode = props.setMode;
    this._rootGetMode = props.getMode;

    const el = this._el = document.querySelector('.nav');

    el.querySelector('.nav__item-main').addEventListener('click', this.setMode.bind(this, 'main'));
    el.querySelector('.nav__item-setup').addEventListener('click', this.setMode.bind(this, 'setup'));


    // отметить выбранный пункт меню
    switch (props.getMode()) {
        case 'main':
            el.querySelector('.nav__item-main').classList.add('nav__item_current');
            break;
        case 'setup':
            el.querySelector('.nav__item-setup').classList.add('nav__item_current');
            break;
    }
};

/**
 * @type app.cmp.Nav
 */
app.cmp.Nav.prototype = {
    /**
     * Изменение режима работы
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
};
