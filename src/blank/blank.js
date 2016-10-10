/**
 *
 * @type {object}
 */
var blank = {

    /**
     *
     */
    init() {

        console.log ('запуск: ');

        document.title = Math.random() + ' ';

        console.log (343444);

    }


};


// DOMContentLoaded
window.addEventListener('DOMContentLoaded', blank.init.bind(blank));

