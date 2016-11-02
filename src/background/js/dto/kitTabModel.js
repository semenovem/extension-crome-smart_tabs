/**
 * DTO передается и возвращается store для сохранения в DB
 * @context app.dto
 * @return {app.dto.KitTabModel}
 */
app.dto.kitTabModel = function(data) {
    return new this.KitTabModel(data, this);
};

/**
 * @constructor
 */
app.dto.KitTabModel = function(data, dto) {
    try {
        const model = new dto.KitModel(data, dto);

        for (let key in model) {
            if (model.hasOwnProperty(key)) {
                this[key] = model[key];
            }
        }

        // tabs of window
        this.tabs = data.tabs.map(dto.tabModel);
        if (!this.tabs.length) {
            throw 'Нет данных вкладок';
        }
    }
    catch (e) {
        throw 'Unable to create dto.kitTabModel.' + e;

        //Поля объекта для jsDocs. Не используются. Удаляться при сборке.
        //<debug>
        this.name = null;
        this.note = null;
        this.tabActive = null;
        this.setTab = null;
        this.tabs = [];
        //</debug>
    }
};
