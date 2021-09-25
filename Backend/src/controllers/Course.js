const {
    Course
  } = require('../database/models');
  
  const bcrypt = require('bcrypt');

module.exports = {
    async handleCreate(req, res){
        try{
            const {
                name,
                description,
                hours
            } = req.body;

            const information = {
                name, 
                description,
                hours
            }

            const courses = await Course.create(information);
            res.status(200).json(courses)
        } catch (err){
            res.status(400).json(err)
        }
    },
    async handleFindAll(req, res){
        try {
            const courseAll = await Course.findAll();
            res.status(200).send(courseAll)
        } catch (err) {
            res.status(400).json(err)
        }
    },
    async handleFindOne(req, res) {
        try {
            const { id } = req.params;

            const courseOne = await Course.findOne({
                where: {
                    id,
                }
            });

            if(!courseOne){
                res.sendStatus(404)
            }

            res.status(200).send(courseOne)
        } catch(err) {
            res.status(400).json(err)
        }
    },
    async handleEdit(req, res) {
        try {

            const { id } = req.params;

            const {
                name,
                description,
                hours
            } = req.body;

            const existingCourse = await Course.findOne({
                where: {
                    id,
                }
            })

            if(!existingCourse){
                res.sendStatus(404)
            }

            existingCourse.name = name;
            existingCourse.description = description;
            existingCourse.hours = hours

            await existingCourse.save()

            res.status(200).send(existingCourse)

        } catch(err) {
            res.status(400).json(err)
        }
    },
    async handleDelete(req, res){
        try {
            const { id } = req.params;

            await Course.destroy({
                where: {
                    id,
                }
            })

            res.sendStatus(200)
        } catch (err) {
            res.status(400).json(err)
        }

    }
}