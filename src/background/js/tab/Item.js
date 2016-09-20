/**
 * Constructor for tab
 * @param {object} raw
 * @constructor
 */
app.TabItem = function(raw) {
    // <debug>
    this.$className = 'TabItem';
    // </debug>

    /**
     * получение полей из модели, которые должны быть у экземпляра
     */
    this.fields
        .filter(field => field.requireNew === true || 'default' in field)
        .forEach(field => {
            let name = field.name;
            this[name] = name in raw ? raw[name] : field.default;
        });
};