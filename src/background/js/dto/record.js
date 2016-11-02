/**
 *
 * @context app.dto
 *
 * @return {app.dto.Record}
 */
app.dto.record = function(data) {
    return new this._app.dto.Record(data, this)
};

/**
 * @constructor
 */
app.dto.Record = function(data, dto) {

    try {
        this.dtoKitTabModel = data.dtoKitTabModel;
        this.itemKey = data.itemKey;
    }
    catch (e) {
        throw 'Unable to create app.dto.Record.' + e;
    }
};
