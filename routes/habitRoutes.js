const express = require('express');
const router = express.Router();
const {
    getAllHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    checkIn,
    getStats,
} = require('../controllers/habitController');

router.route('/')
    .get(getAllHabits)
    .post(createHabit);

router.route('/:id')
    .put(updateHabit)
    .delete(deleteHabit);

router.post('/:id/checkin', checkIn);
router.get('/:id/stats', getStats);

module.exports = router;
