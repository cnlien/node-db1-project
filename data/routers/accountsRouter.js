const express = require('express')
const knex = require('../dbConfig')
const router = express.Router();

router.get('/', async (req,res) => {
    // const sql = knex.select('*').from('accounts').toString()
    // console.log(sql)
    try {
        const accounts = await knex('accounts');
        res.json(accounts)
    }
    catch {
        res.status(500).json({message: "There was an error on the server", error: err})
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const account = await knex.select('*').from('accounts').where({id}).first()
        account
            ? res.status(200).json(account)
            : res.status(400).json({message: "Account not found"})
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message: "There was an error on the server", error: err})
    }
})

router.post('/', async (req, res) => {
    const newAccount = req.body
    try {
        const account = await knex.insert(newAccount).into('accounts')
        res.status(201).json(account)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "There was an error on the server", error: err})
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const changes = req.body

    try {
        const count = await knex('accounts').update(changes).where({id})
        count
            ? res.json({ updated: count, id: id, changes: changes })
            : res.status(404).json( {message: "That account does not exisit" })
    }
    catch (err) {
        res.status(500).json({ message: "There was an error on the server", error: err })
    }
})

router.delete('/:id', async (req,res) => {
    const { id } = req.params;

    try {
        const count = await knex('accounts').where({id}).del();
        count
            ? res.status(200).json({ deleted: count, accountId: id})
            : res.status(404).json({ message: "That account does not exisit" })
    }
    catch (err) {
        res.status(500).json({ message: "There was an error on the server" })
    }
})


module.exports = router;