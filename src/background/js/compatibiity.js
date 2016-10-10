/**
 * Проверка совместимости приложения с браузером
 */
app.compatibility = function() {
    const ITEM_TEST = '_test';

    return new Promise((resolve, reject) => {

        if (typeof window.chrome === 'undefined') {
            reject('нет объекта chrome');
        }

        if (typeof window.chrome.tabs === 'undefined') {
            reject('нет объекта chrome.tabs');
        }

        if (typeof window.chrome.windows === 'undefined') {
            reject('нет объекта chrome.windows');
        }

        // проверка localStorage
        if (typeof window.localStorage === 'undefined') {
            reject('нет объекта localStorage');
        }
        const test = ITEM_TEST + Math.random();
        localStorage.setItem(ITEM_TEST, test);
        if (localStorage.getItem(ITEM_TEST) !== test) {
            reject('ошибка при записи в localStorage');
        }
        localStorage.removeItem(ITEM_TEST);

        resolve(this);
    })
        .catch(e => {
            this.log({
                name: 'Приложение не прошло проверку на совместимость с платформой',
                event: e
            });
            throw(e);
        });
};
