/**
 * Constructor the state object
 * @constructor
 */
app.Condition = function() {
    // <debug>
    this.$className = 'Condition';
    // </debug>

    this._promise = new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
    });
    this.get = () => this._promise;

    this.resolve = (...arg) => {
        if (this._resolve) {
            this._resolve.apply(null, arg);
            this._del();
        }
    };

    this.reject = (...arg) => {
        if (this._reject) {
            this._reject.apply(null, arg);
            this._del();
        }
    };
};

app.Condition.prototype = {
    _del() {
        delete this._resolve;
        delete this._reject;
    }
};
