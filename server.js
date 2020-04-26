const express = require('express');
const path = require('path');
const app = express();
const request = require('request');
const PORT = process.env.PORT || 5000;

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});

app.get('', (req, res) => {
    res.render('index', {});
});

app.get('/breaking', (req, res) => {
    var url =
        'https://newsapi.org/v2/top-headlines?q=covid&apiKey=0458383730a544b694916761a8b624ec';
    request({ url, json: true }, function(error, response, body) {
        const articleArray = body.articles;
        articleArray.forEach((article) => {
            delete article.author;
            delete article.source;
            delete article.urlToImage;
            delete article.publishedAt;
            delete article.content;
        });
        res.send({ articles: articleArray });
    });
});

app.get('/news', (req, res) => {
    var country = req.query.country;
    country.toLowerCase();
    var url = `https://newsapi.org/v2/top-headlines?q=covid&country=${country}&apiKey=0458383730a544b694916761a8b624ec`;
    var urlDefault = `https://newsapi.org/v2/top-headlines?q=covid&country=us&apiKey=0458383730a544b694916761a8b624ec`;
    request({ url, json: true }, function(error, response, body) {
        const articleArray = body.articles;
        articleArray.forEach((article) => {
            delete article.author;
            delete article.source;
            delete article.urlToImage;
            delete article.publishedAt;
            delete article.content;
        });

        if (body.totalResults == 0) {
            return res.send({
                articles: [
                    {
                        title:
                            'Could not find any news for the selected country',
                        description:
                            'Sorry!🥺',
                        url: 'https://www.youtube.com/watch?v=Law_PUuzOTk',
                    },
                ],
            });
        }
        res.send({ articles: articleArray });
    });
});
