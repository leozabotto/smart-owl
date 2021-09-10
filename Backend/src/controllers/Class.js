const {
    Class
} = require('../database/models');


module.exports = {
    async handleCreate(req, res){
        try{
            const {
                name,
                ageGroup,
                status,
                openingQuantity
            } = req.body;

            const info = {
                name,
                ageGroup,
                status,
                openingQuantity
            }

            const classes = await Class.create(info)
            res.status(200).json(classes)
        } catch (err) {
            res.status(400).json(err)
        }
    },

    async handleEdit(req, res){
        try {

            const { id } = req.params;

            const {
                name, 
                ageGroup,
                status,
                openingQuantity
            } = req.body;

            const existingClass = await Class.findOne({
                where: {
                    id,
                }
            })

            if(!existingClass){
                res.sendStatus(404)
            }

            existingClass.name = name
            existingClass.ageGroup = ageGroup
            existingClass.status = status
            existingClass.openingQuantity = openingQuantity

            await existingClass.save()

            res.status(200).send(existingClass)

        } catch (err) {
            res.status(400).json(err)
        }
    },
    
    async handleFindAll(req, res){
        try {
            const classall = await Class.findAll();
            res.status(200).send(classall)
        } catch (err) {
            res.status(400).json(err)
        }
    },

    async handleFindOne(req, res){
        try{
            const { id } = req.params;

        const existingClassId = await Class.findOne({
            where: {
                id,
            }
        })

        if(!existingClassId){
            res.sendStatus(404)
        }

        res.status(200).send(existingClassId);
        } catch (err) {
            res.status(400).json(err)
        }
        
    },

    async handleDelete(req, res){
        try {
            const { id } = req.params;

            await Class.destroy({
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