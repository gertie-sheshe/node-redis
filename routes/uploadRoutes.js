const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');

const s3 = AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
});

module.exports = (app) => {
 app.get('/api/upload', () => {
     const key = `${req.user.id}/${uuid()}.jpeg`
    s3.getSignedUrl('putObject', {
        Bucket: 'gertie-blog-bucket-123',
        ContentType: 'jpeg',

    })
 });
}