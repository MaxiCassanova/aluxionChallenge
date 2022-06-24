const aws = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET = process.env.AWS_SECRET;

const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

const listController = (req, res) => {
    s3.listObjectsV2({
        Bucket: AWS_BUCKET_NAME,
        }, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
}

const uploadController = (req, res) => {
    const file = req.files.file;
    const fileName = file.name;
    const fileExtension = file.originalname.split('.')[1];
    const date = new Date().toDateString();

    s3.upload({
        Bucket: AWS_BUCKET_NAME,
        Key: `${date}${fileName}.${fileExtension}`,
        Body: file.buffer
    }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
}

const downloadController = (req, res) => {
    s3.getSignedUrl('getObject', {
        Bucket: AWS_BUCKET_NAME,
        Key: req.query.key,
        Expires: 60,
        }, (err, url) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.status(200).send(url);
            }
    });
}

const manageController = (req, res) => {
    const { key, operation, name } = req.body;
    if(!key) return res.status(400).json({message: 'Key is required'});

    if (operation === 'changeName'){
        if(!name){
            return res.status(400).json({message: 'Name is required'});
        }
        s3.copyObject({
            Bucket: AWS_BUCKET_NAME,
            CopySource: `${AWS_BUCKET_NAME}/${key}`,
            Key: `${name}.${key.split('.')[1]}`
        }, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                s3.deleteObject({
                    Bucket: AWS_BUCKET_NAME,
                    Key: key
                }, (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(data);
                    }
                });
            }
        });
    if (operation === 'getUrl')
        s3.getSignedUrl('getObject', {
            Bucket: AWS_BUCKET_NAME,
            Key: key,
            Expires: 60,
            }, (err, url) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send(url);
                }
        });
    }
}

module.exports = {
    listController,
    uploadController,
    downloadController,
    manageController,
}