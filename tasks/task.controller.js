const TaskModel = require('./task.model');
const Sendgrid = require('../integrations/sendgrid');
const Cloudinary = require('../integrations/cloudinary');
const _ = require('lodash');

module.exports = class Tasks {

    static async images(req, res) {
        let images = await Cloudinary.upload(req.files);
        let taskTmp = await TaskModel.findById(req.params.taskId).select('images').lean().exec();

        TaskModel.findByIdAndUpdate(taskTmp._id, {
            images: _.concat(taskTmp.images || [], _.map(images, img => img.url))
        }, {
            new: true,
            safe: true
        }).lean().exec().then(doc => {
            res.send(doc);
        }, err => {
            res.status(500).send(err);
        });
    }


    static delete(req, res) {
        const id = req.params.taskId;
        // TaskModel.findByIdAndDelete(id).exec((err, doc) => {
        //    res.send(doc);
        // });
        /**
         * No la eliminamos solo la ocultamos, asi no perdemos datos
         */
        TaskModel.findByIdAndUpdate(id, {
            enable: false
        }, {
            new: true,
            safe: true
        }).exec((err, doc) => {
            res.send(doc);
        });
    }

    static update(req, resp) {
        const id = req.params.taskId;
        TaskModel.findByIdAndUpdate(id, req.body, {
            new: true,
            safe: true
        }).exec((err, doc) => {
            resp.send(doc);
        });
    }

    static completed(req, res) {
        console.log('Entrando en completado');
        const id = req.params.taskId;
        TaskModel.findByIdAndUpdate(id, {
            completed: req.body.completed
        }, {
            new: true,
            safe: true
        }).exec((err, doc) => {
            Sendgrid.send({
                task: doc
            }).then(() => {
                res.send(doc);
            });
        });
    }

    static create(req, resp) {
        TaskModel.create(req.body, (err, doc) => {
            resp.send(doc);
        });
    }

    static list(req, resp) {
        let q = req.query;
        let findParams = {
            enable: true
        };
        let queryParams = {
            sort: 'createdAt'
        };

        if (q.sort) {
            queryParams.sort = q.sort;
        }

        if (q.filter) {
            findParams[q.filter.replace('-', '')] = q.filter.includes('-') ? -1 : 1;
        }

        TaskModel.find(findParams, {}, queryParams).exec((err, docs) => {
            resp.send(docs);
        });
    }

    static read(req, res) {
        const id = req.params.taskId;
        TaskModel.findById(id).exec((err, doc) => res.send(doc));

    }
}