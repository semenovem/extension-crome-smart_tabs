/**
 * Получить данные по открытым окнам
 * context = app
 *
 * implementation
 * получение views всех открытых окон
 * получение объектов kit по их view (если обекта нет - будет создан)
 * получение моделей (model)
 * добавление в объект модели дополнительных свойств: id окна
 *
 * @param {object} params {*} не обрабатываем
 * @param {Promise<Array>} массив моделей окон
 */
app.defineMsgHandler('open.kits.get', function() {
    return this.browserApi.windows.getAll({ populate: true })
        .then(views => views.map(view => {
            const model = this.kitCollect.getByView(view).getModel(view);
            model.id = view.id;
            return model;
        }))
});