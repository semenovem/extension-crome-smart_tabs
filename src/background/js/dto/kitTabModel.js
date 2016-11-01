/**
 * DTO передается и возвращается store для сохранения в DB
 *
 * @context app.dto
 *
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

        // tabs of window
        model.tabs = data.tabs.map(dto.tabModel);
        if (!model.tabs.length) {
            throw 'Нет данных вкладок';
        }
        return model;
    }
    catch (e) {
        throw 'Unable to create dto.kitTabModel.' + e;
    }
    // <debug>
    this.name = null;
    this.note = null;
    this.tabActive = null;
    this.setTab = null;
    // </debug>
};
