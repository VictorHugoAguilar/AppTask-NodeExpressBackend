const config = require('../config/config');

const cloudinary = require('cloudinary');
const async = require('async');
const _ = require('lodash');


//CLOUDINARY_URL=cloudinary://488267212225138:tQmTcz_h8ZnnIl32Xhkh8G3YPGQ@lavaca
cloudinary.config({
    cloud_name: 'lavaca',
    api_key: '488267212225138',
    api_secret: 'tQmTcz_h8ZnnIl32Xhkh8G3YPGQ'
});

module.exports = class Cloudy {

    static upload(images) {
        //console.log(images);
        return new Promise((resolve, reject) => {
            let uploaded = [];
            async.each(images, (file, cb) => {
                if (file && file.data) {
                    // console.log(file);
                    cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.data.toString('base64')}`,
                        res => {
                            //console.log('imangen subida', res);
                            uploaded.push({
                                url: res.url ? res.url.replace(/http:\/\//, 'https://') : res.url
                            });
                            cb(null);
                        });
                } else {
                    cb(null);
                }
            }, err => {
                if (!err) {
                    // console.log('subido', uploaded);
                    return resolve(uploaded);
                }
                // console.log(err)
                return reject(err);
            });
        });
    }
}