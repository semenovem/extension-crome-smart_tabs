/**
 * Constructor for tab
 * @param {object} view
 * @constructor
 */
app.TabItem = function(view) {
    // <debug>
    this.$className = 'TabItem';
    // </debug>

    /**
     * получение полей из модели, которые должны быть у экземпляра
     */
    this._app.tabFields
        .filter(field => field.requireTab || (field.tab && ('default' in field || field.name in view)))
        .forEach(field => {
            let name = field.name;
            this[name] = name in view ? view[name] : field.default;
        });
};
