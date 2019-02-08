const express = require('express');
const router = express.Router();
const projectsDB = require('../data/helpers/projectModel');
const actionsDB = require('../data/helpers/actionModel.js');

// GET ALL PROJECTS
router.get('/', (req, res) => {
    projectsDB
        .get()
        .then(projects => res.json(projects))
        .catch(err => res.status(500).json({ error: "The project could not be retrieved"}))
})

// GET ONE SPECIFIC PROJECT
router.get('/:id', (req, res) => {
	const id  = req.params.id;
	projectsDB
		.get(id)
		.then(project => {
			if(project.id) {
				res.json(project)
			}
			else {
                res
                    .status(404)
					.json({ message: "The project with that specified ID was not found" })
			}
		})
		.catch(err => {
			res
				.status(500)
				.json({ message: "Failed to retreive project" })
		})
});

// POST 
router.post('/', (req, res) => {
    const { name, description } = req.body;
    const newProject = { name, description };
    if(!name || !description) {
        res
            .status(400)
            .json.apply({ message: "The project name and/or description are missing"})
    } else {
        projectsDB
            .insert(newProject)
            .then(post => res.json(post))
            .catch(err => res.status(500).json({ error: "Failed to add new project"}))
    }
})

// PUT 
router.put('/:id', (req, res) => {
	const id = req.params.id;
	const { name, description } = req.body;
	const newProject = { name, description }
	if(!name || !description) {
		res
		.status(400)
		.json.apply({ message: "The project name and/or description are missing"})
	} else {
		projectsDB
		.update(id, newProject)
		.then(project => {
			if(project) { 
				res.json(project) 
			}
			else {
				res
					.status(404)
					.json({ error: "Project with specified ID not found" })
			}
		})
		.catch(err =>
			res
				.status(500)
				.json({ error: "Failed to update project" })
		);
	}
});


// DELETE
router.delete('/:id', (req, res) => {
	const id = req.params.id;
	projectsDB
		.remove(id)
		.then(count => {
			if(count) {
				projectsDB.actionsDB(id).then(actions => {
					actions.map(action => {
						console.log("action.id:", action.id);
						actionsDB.remove(action.id).then(() => {
							console.log("Your action(s) was deleted");
						});
					})
					res.json({ message: "This project was successfully deleted "})
				}) 
			} else {
				res
					.status(404)
					.json({ error: "Project with specified id not found" })
			}
		})
		.catch(err =>
			res
				.status(500)
				.json({ error: "Failed to delete project!", err })
		);
});

module.exports = router;