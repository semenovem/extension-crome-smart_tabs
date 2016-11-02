/**
 * объект вкладки для записи в DB
 * @context app.dto
 * @return {app.dto.TabModel}
 */
app.dto.tabModel = function(data) {
    return new app.dto.TabModel(data, this);
};

/**
 * @constructor
 */
app.dto.TabModel = function(data, dto) {
    try {

        //
        if (typeof data.url === 'string' && data.url.length <= 2000) {
            this.url = data.url;
        }

        if (typeof data.title === 'string' && data.title.length <= 300 && data.title) {
            this.title = data.title;
        }

        if (typeof data.favIconUrl === 'string' && data.favIconUrl.length <= 300 && data.favIconUrl) {
            this.favIconUrl = data.favIconUrl;
        }

        //if (typeof data.history === 'boolean' && data.history !== false) {
        //    this.history = data.history;
        //}

        // required fields
        if (!this.url) {
            throw 'Нет обязательного поля url';
        }

    }
    catch (e) {
        throw 'Unable to create dto.tabModel.' + e;
    }
};
