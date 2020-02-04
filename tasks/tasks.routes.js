const TaskController = require('./task.controller');

const middleware = require('../middleware/middleware');


module.exports = app => {

    app.route('/tasks')
        .get(middleware.isValidDomain, TaskController.list)
        .post(middleware.isValidDomain, TaskController.create);

    app.route('/tasks/:taskId')
        .get(middleware.isValidDomain, TaskController.read)
        .put(middleware.isValidDomain, TaskController.update)
        .delete(middleware.isValidDomain, TaskController.delete);

    app.route('/tasks/:taskId/completed')
        .put(middleware.isValidDomain, TaskController.completed);

    app.route('/tasks/:taskId/images')
        .put(middleware.isValidDomain, TaskController.images);
};