/**
 * объект окна из событий browser api
 *
 * @context app.dto
 *
 * @return {app.dto.TabView}
 */
app.dto.tabView = function(data) {
    return new app.dto.TabView(data, this);
};

/**
 * @constructor
 */
app.dto.TabView = function(data, dto) {

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

        if (dto.moreZero(data.tabId)) {
            this.tabId = data.tabId;
        }
        if (dto.moreZero(data.kitId)) {
            this.kitId = data.kitId;
        }

        // required fields
        if (!this.url) {
            throw 'Нет обязательного поля url';
        }
        if (!this.tabId) {
            throw 'Нет обязательного поля url';
        }
    }
    catch (e) {
        throw 'Unable to create dto.tabModel.' + e;
    }
};
