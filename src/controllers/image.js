const URL_UNSPLASH = 'https://api.unsplash.com/';
const axios = require('axios');
const dotenv = require('dotenv');
const { s3 } = require('./file')
dotenv.config();

const API_KEY = 'client_id=' + process.env.UNSPLASH_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;



const searchController = async (req, res) => {
    const query = req.query.query;
    let page = req.query.page;
    if(!query) res.status(400).send('Query is required');
    if(!page) page = 1;
    const url = `${URL_UNSPLASH}search/photos?query=${query}&page=${page}&${API_KEY}`;
    await axios(url)
        .then(response => {
            return res.send(response.data);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send(error);
        });
}

const uploadController = async (req, res) => {
    const id = req.query.id;
    const url = `${URL_UNSPLASH}photos/${id}?${API_KEY}`;
    let data = await axios(url)
        .then(response => {
            return response.data;
        }).catch(error => {
            console.log(error);
            return res.status(500).send(error);
        });
    let image = await axios(data.urls.full);
    let fileName = data.id;
    let fileExtension = '.jpg';
    let date = new Date().toDateString();

    s3.upload({
        Bucket: AWS_BUCKET_NAME,
        Key: `${date}${fileName}.${fileExtension}`,
        Body: image.data
    }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
    res.status(200).send({message: 'Image uploaded'});
}

module.exports = {
    searchController,
    uploadController
}