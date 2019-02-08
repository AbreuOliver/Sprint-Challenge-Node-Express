const express = require('express');
const router = express.Router();
const actionsDB = require('../data/helpers/actionModel');

// GET ALL ACTIONS
router.get('/', (req, res) => {
    actionsDB
        .get()
        .then(projects => res.json(projects))
        .catch(err => res.status(500).json({ error: "Action information could not be retrieved"}))
})

// GET ONE SPECIFIC ACTION
router.get('/:id', (req, res) => {
    const id = req.params.id;
    actionsDB
        .get(id)
        .then(action => {
            if(action.id) {
                res.json(action)
            }
            else {
                res
                    .status(404)
                    .json({ message: "The action with that specified ID was not found"})
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ message: "Failed to retrieve action" })
        })
})

// POST  CHECK TO SEE THAT THE PROJECT ID EXISTS BEFORE CREATING AN ACTION
router.post('/', (req, res) => {
    const { project_id, description, notes } = req.body;
    const newAction = { project_id, description, notes };
    if(!project_id || !description || !notes) {
        res
            .status(400)
            .json({ message: "Please input project id/description/notes to continue"})
    } else {
        actionsDB
            .insert(newAction)
            .then(post => res.json(post))
            .catch(err => res.status(500).json({ error: "Failed to add a new action"} ))
    }
})

// PUT
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const newAction = req.body;
    actionsDB
        .update(id, newAction)
        .then(action => {
            if(action) {
                res.json(action)
            } else {
                res
                    .status(500)
                    .json({ message: "Action at specified ID not found"})
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ message: "Faled to upload action"})
        })
})

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    actionsDB
        .remove(id)
        .then(count => {
            if (count) {
                res.json({ message: "Action successfully deleted"})
            } 
            else {
                res
                    .status(404)
                    .json({ error: "Action at specified ID could not be found "})
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "Failed to delete action" })
        })
})

module.exports = router