/**
 * Constructor tab
 * @param {app.dto.TabView} view
 * @constructor
 */
app.Tab = function(view) {
    // <debug>
    this.$className = 'app.Tab';
    // </debug>

    this._tabId = view.tabId;
    this._discarded = false;
    this._status = '';
    this._url = view.url;
    this._title = 'title' in view ? view.title : '';
    this._favIconUrl = 'favIconUrl' in view ? view.favIconUrl : '';

};
