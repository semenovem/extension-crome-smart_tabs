/**
 * объект вкладки для записи в DB
 * context = app.dto
 *
 * @return {object}
 */
app.dto.tabModel = function(data) {
    try {
        const obj = {};

        //
        if (typeof data.url === 'string' && data.url.length <= 2000) {
            obj.url = data.url;
        }

        if (typeof data.title === 'string' && data.title.length <= 300) {
            obj.title = data.title;
        }

        if (typeof data.favIconUrl === 'string' && data.favIconUrl.length <= 300) {
            obj.favIconUrl = data.favIconUrl;
        }


        if (typeof data.history === 'boolean') {
            obj.history = data.history;
        }





        // required fields
        if (!obj.url) {
            throw 'Нет обязательного поля url';
        }

        return obj;
    }
    catch (e) {
        throw 'Unable to create dto.tabModel.' + e;
    }
};
