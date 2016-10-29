/**
 *
 * @class app.Util
 */
app.util = {
    // <debug>
    $className: 'Util',
    // </debug>

    /**
     * Создать dom элемент из html
     * @param {String} html
     * @return {Element}
     */
    htmlToEl(html) {
        const elTmp = document.createElement('DIV');
        elTmp.innerHTML = html;
        return elTmp.firstElementChild;
    }
};
