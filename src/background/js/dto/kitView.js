/**
 * объект окна из событий browser api
 * @context app.dto
 *
 * @return {app.dto.KitView}
 */
app.dto.kitView = function(data) {
    return new app.dto.KitView(data, this);
};

/**
 * @constructor
 */
app.dto.KitView = function(data, dto) {
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

        // required fields
        if (!this.kitId) {
            throw 'нет ID у окна'
        }
    }
    catch (e) {
        throw 'Unable to create dto.KitView.' + e;
    }
};
