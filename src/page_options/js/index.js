

document.addEventListener('DOMContentLoaded', function() {

    //let node = document.getElementById('status');
    //
    //node.innerHTML = Math.random();
    //
    //
    //let elButtomBlank = document.getElementById('blank');
    //if (elButtomBlank) {
    //
    //    elButtomBlank.addEventListener('click', popup.createBlank);
    //
    //}


});


/**
 * @type {object}
 */
let options = {

    /**
     *
     */
    init() {
        for (let key in this) {
            if (this.hasOwnProperty(key) && typeof this[key] === 'function') {
                this[key] = this[key].bind(this);
            }
        }
    },

    /**
     * Создать пустую страницу
     */
    createBlank() {
        console.log (2345234);
//
  //      this._message.msg('create.blank');



    },

    /**
     * Объект для обмена данными с backend
     * @type {object}
     */
    _message: new Message('options')






    // запрос данных


    // отобразить данные





};


options.init();