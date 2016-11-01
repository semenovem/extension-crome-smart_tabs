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
        const view = new dto.KitView(data, dto);

        // tabs of window
        view.tabs = data.tabs.map(dto.tabView);
        if (!view.tabs.length) {
            throw 'Нет данных вкладок';
        }

        return view;
    }
    catch (e) {
        throw 'Unable to create app.dto.KitTabView.' + e;
    }
};
