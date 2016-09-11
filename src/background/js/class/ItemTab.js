/**
 * Constructor for tab
 * @param {object} raw
 * @constructor
 */
app.ItemTab = function(raw) {
    // <debug>
    this.$className = 'ItemTab';
    // </debug>

    /**
     * получение полей из модели, которые должны быть у экземпляра
     */
    this.fields
        .filter(field => field.requireForCreate === true || 'default' in field)
        .forEach(field => {
            let name = field.name;
            this[name] = name in raw ? raw[name] : field.default;
        });
};