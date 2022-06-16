const router = require('express').Router()
const Fav = require('../models/GifsFav')
const Joi = require('@hapi/joi')

const favSchema = Joi.object({
    id: Joi.string().min(6).max(255).required(),
    title: Joi.string().min(3).max(255).required(),
    user: Joi.string().min(6).max(255).required().email()
})

router.post('/add/:id/:title/:user', async (req, res) => {
    const { error } = favSchema.validate(req.params)

    if (error) {
        return res.status(400).json(
            { error: error.details[0].message }
        )
    }

    const fav = new Fav({
        idFav: req.params.id,
        title: req.params.title,
        user: req.params.user
    });

    try {
        const favs = []
        const user = req.params.user
        const savedFav = await fav.save()
        const listFav = await Fav.find({ user }, function (err, data) {
            if (err) {
                res.status(400).json({ error: 'Favorites not found' });
            } else {
                for (var i in data) {
                    favs.push(data[i].idFav);
                }
                res.send({
                    "favs": favs
                })
            }
        }).clone().catch(function (err) { console.log(err) });

    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/getfavs/:user', async (req, res) => {
    const user = req.params.user
    const favs = []

    const getFavs = await Fav.find({ user }, function (err, data) {
        if (err) {
            res.status(400).json({ error: 'Favorites not found' });
        } else {
            for (var i in data) {
                favs.push(data[i].idFav);
            }
            res.send({
                "favs": favs
            })
        }
    }).clone().catch(function (err) { console.log(err) });
    return getFavs

})

router.post('/removefav/:id/:user', async (req, res) => {
    const idFav = req.params.id
    const user = req.params.user
    const favs = []

    const removeFav = await Fav.deleteOne({ idFav }, function (err, data) {
        if (err) {
            res.status(400).json({ error: 'Couldnt delete this gif from favorites' });
        } else {
            const getFavs = Fav.find({ user }, function (err, data) {
                if (err) {
                    res.status(400).json({ error: 'Favorites not found' });
                } else {
                    for (var i in data) {
                        favs.push(data[i].idFav);
                    }
                    res.send({
                        "favs": favs
                    })
                }
            }).clone().catch(function (err) { console.log(err) });
        }
    }).clone().catch(function (err) { console.log(err) });
})

module.exports = router;