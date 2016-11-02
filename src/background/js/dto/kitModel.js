/**
 * DTO передается и возвращается store для сохранения в DB
 * @context app.dto
 * @return {app.dto.KitModel}
 */
app.dto.kitModel = function(data) {
    return new this._app.dto.KitModel(data, this);
};

/**
 * @constructor
 */
app.dto.KitModel = function(data, dto) {
    try {

        // the size and position of the window
        if (dto.notNegative(data.left) && data.left !== 0) {
            this.left = data.left;
        }
        if (dto.notNegative(data.top) && data.top !== 0) {
            this.top = data.top;
        }
        if (dto.notNegative(data.width) && data.width !== 0) {
            this.width = data.width;
        }
        if (dto.notNegative(data.height) && data.height !== 0) {
            this.height = data.height;
        }

        // state of window
        if (dto.kitState(data.state) && data.state !== dto.kitStateDefault) {
            this.state = data.state;
        }

        // the number of the active tab
        if (dto.notNegative(data.tabActive) && data.tabActive !== 0) {
            this.tabActive = data.tabActive;
        }

        // название окна, заданное пользователем
        if (typeof data.name === 'string' && data.name.length <= 300 && data.name) {
            this.name = data.name;
        }

        // описание окна
        if (typeof data.note === 'string' && data.note.length <= 300 && data.note) {
            this.note = data.note;
        }

        try {
            const setTab = data.setTab;
            const dtoSetTab = {};

            // не загружать вкладку, пока она не будет выбрана
            if (typeof setTab.discardCreate === 'boolean' && setTab.discardCreate !== true) {
                this.setTab.discardCreate = setTab.discardCreate;
            }

            // сохранять состояние закрытых вкладок
            if (typeof setTab.watchClose === 'boolean' && setTab.watchClose !== true) {
                this.setTab.watchClose = setTab.watchClose;
            }

            // сохранять историю url
            if (typeof setTab.watchHistory === 'boolean' && setTab.watchHistory !== true) {
                this.setTab.watchHistory = setTab.watchHistory;
            }

            if (Object.keys(dtoSetTab).length) {
                this.setTab = dtoSetTab;
            }
        }
        catch(e) {}



        // required fields
        // ----


    }
    catch (e) {
        console.error('--', e);
        throw 'Unable to create dto.KitModel' + e;
    }
};
