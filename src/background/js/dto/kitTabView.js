/**
 * объект окна из событий browser api
 *
 * @context app.dto
 *
 * @return {app.dto.KitTabView}
 */
app.dto.kitTabView = function(data) {
    return new app.dto.KitTabView(data, this);
};

/**
 * @constructor
 */
app.dto.KitTabView = function(data, dto) {
    try {
        //
        if (dto.moreZero(data.kitId)) {
            this.kitId = data.kitId;
        }

        // the size and position of the window
        if (dto.notNegative(data.left)) {
            this.left = data.left;
        }
        if (dto.notNegative(data.top)) {
            this.top = data.top;
        }
        if (dto.notNegative(data.width)) {
            this.width = data.width;
        }
        if (dto.notNegative(data.height)) {
            this.height = data.height;
        }

        // the number of the active tab
        if (dto.notNegative(data.tabActive)) {
            this.tabActive = data.tabActive;
        }

        // state of window
        if (dto.kitState(data.state)) {
            this.state = data.state;
        }

        // tabs of window
        this.tabs = data.tabs.map(dto.tabView);
        if (!this.tabs.length) {
            throw 'Нет данных вкладок';
        }

        // required fields
        if (!this.kitId) {
            throw 'нет ID у окна'
        }
    }
    catch (e) {
        throw 'Unable to create app.dto.KitTabView.' + e;
    }
};
