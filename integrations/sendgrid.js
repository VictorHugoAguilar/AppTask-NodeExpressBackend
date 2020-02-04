const config = require('../config/config');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

module.exports = class Sendgrid {

    static send(params) {
        return sgMail.send({
            to: 'victor03016@gmail.com',
            from: 'EXPRESS-API <victor03016@gmail.com>',
            subject: 'Notificacion de complitud de tares',
            text: 'and easy to do anywhere, even with Node.js',
            html: `Se completo la tarea ${ params.task.title }`
        });
    }

}