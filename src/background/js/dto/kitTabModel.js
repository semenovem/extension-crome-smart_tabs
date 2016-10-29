/**
 * объект окна для записи в DB
 * context = app.dto
 *
 * @return {dto.kitTabModel}
 */
app.dto.kitTabModel = function(data) {
    try {
        const obj = {};

        // the size and position of the window
        if (this.notNegative(data.left)) {
            obj.left = data.left;
        }
        if (this.notNegative(data.top)) {
            obj.top = data.top;
        }
        if (this.notNegative(data.width)) {
            obj.width = data.width;
        }
        if (this.notNegative(data.height)) {
            obj.height = data.height;
        }

        // the number of the active tab
        if (this.notNegative(data.tabActive)) {
            obj.tabActive = data.tabActive;
        }

        // state of window
        if (this.kitState(data.state)) {
            obj.state = data.state;
        }

        // tabs of window
        obj.tabs = data.tabs.map(this.tabModel).filter(tabModel => tabModel);
        if (!obj.tabs.length) {
            throw 'Нет данных вкладок';
        }


        // required fields


        return obj;
    }
    catch (e) {
        throw 'Unable to create dto.kitTabModel.' + e;
    }
};
