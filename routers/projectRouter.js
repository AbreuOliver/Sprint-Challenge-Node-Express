const express = require('express');
const router = express.Router();
const projectsDB = require('../data/helpers/projectModel');
const actionsDB = require('../data/helpers/actionModel.js');

// GET ALL PROJECTS  ** FUNCTIONING **
router.get('/', (req, res) => {
    projectsDB
        .get()
        .then(projects => res.json(projects))
        .catch(err => res.status(500).json({ error: "The project could not be retrieved"}))
})

// GET ONE SPECIFIC PROJECT  ** FUNCTIONING **
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

// POST  ** FUNCTIONING **
router.post('/', (req, res) => {
    const { name, description } = req.body;
    const newProject = { name, description };
    if(!name || !description) {
		return
			res
				.status(400)
				.json.apply({ message: "The project name and/or description are missing"})
    } else {
        projectsDB
			.insert(newProject)
			.then(post => res
				.status(201)
				.json(post))
            .catch(err => res.status(500).json({ error: "Failed to add new project"}))
    }
})

// PUT  ** FUNCTIONING **
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
router.delete("/:id", (req, res) => {
	const id = req.params.id;
	projectsDB
		.remove(id)
		.then(count => {
			if (count) {
				projectsDB.getProjectActions(id)
					.then(response => {
						response.map(action => {
							actionsDB
								.remove(action.id)
								.then(() => {})
						})
						res
							.json({ 
								messsage: `Project #${id} was successfully deleted`
							})
					})
			} else {
				res
					.status(404)
					.json({
						message: `Project with ID #${id} does not exist`
					})
			}
		})
		.catch(() => {
			res
				.status(500)
				.json({ 
					error: `Internal server error: The project #${id} could not be removed from the database`
				})
		})
})

module.exports = router;