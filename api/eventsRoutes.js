const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Event = require('./eventsModels');




router.get('/', (req, res, next) => {
    Event.find()
    // .select(' _id title host venue about price dtime')
    .exec()
    .then( docs => {
       
        const response = {
            count: docs.length,
            events: docs.map(doc => {
                return {
                    _id: doc._id,
                    title: doc.title,
                    host: doc.host,
                    venue: doc.venue,
                    about: doc.about,
                    price: doc.price,
                    dtime: doc.dtime,
                    eventImage: doc.eventImage,
                    request : {
                        type: 'GET',
                        url: 'http://localhost:7778/events/' + doc._id
                    }                    
                }
            })

        }
        
        if (docs.length >= 0){         
            res.status(200).json(response);            
        } else {
            res.status(404).json({
                message: "No entry found"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });


});


router.post('/', checkAuth, upload.single('eventImage'), (req, res, next) => {
    
    console.log(req.file);
    const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        host: req.body.host,
        venue: req.body.venue,
        about: req.body.about,
        price: req.body.price,
        dtime: req.body.dtime,
        eventImage: req.file.path
    });

    event.save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Object created",
            createdEvent: {
                _id: result._id,
                title: result.title,
                price: result.price,
                request: {
                    type: 'GET',
                    url: 'http://localhost:7778/events/' + result._id
                }

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
    

});

router.get('/:_id', (req, res, next) =>{
    const id = req.params._id;
    Event.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json({
                event: doc,
                request: {
                    type: 'GET',
                    description: 'Get all events',
                    url: 'http://localhost:7778/events'
                }
            });
        } else {
            res.status(404).json({message: "No valid entry found"});
        }
 
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({error: err})
    });
})

router.delete("/:_id", checkAuth, (req, res, next) => {
    const id = req.params._id;
    Event.remove({ _id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Event deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:7778/events',
                data: {title: 'String', host: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch("/:_id", checkAuth, (req, res, next) => {
    const id = req.params._id;
    const updatOps = {};
    for ( const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Event.update({_id: id}, { $set: updatOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Event updated',
            request: {
                type: 'GET',
                url: 'http://localhost:7778/events' + id

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

})

module.exports = router;

