/**
 * Закрытие приложения
 * @function
 */
app.quit = function() {
    try {
        this.log({
            name: 'Закрытие приложения',
            type: ''
        });




        this.controllerEvent.remove('all');



        // записать не сохраненные данные
        // ....



        window[this.globalName] = null;

    } finally {}
};


