const express = require('express');
const router = express.Router();
const checkAuthToken = require('../Middlewares/checkAuthToken');
const User = require('../Models/UserSchema');

// Utility to calculate maxCalorieIntake
function calculateMaxCalorieIntake(user) {
    let BMR, maxCalorieIntake;
    const heightInCm = parseFloat(user.height[user.height.length - 1].height);
    const weightInKg = parseFloat(user.weight[user.weight.length - 1].weight);
    const age = new Date().getFullYear() - new Date(user.dob).getFullYear();
    
    if (user.gender === 'male') {
        BMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age);
    } else { // Assuming female if not male
        BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
    }

    if (user.goal === 'weightLoss') {
        maxCalorieIntake = BMR - 500 * 10;
    } else if (user.goal === 'weightGain') {
        maxCalorieIntake = BMR + 500 * 10;
    } else {
        maxCalorieIntake = BMR * 10; //maintenance or unspecified goal
    }

    return maxCalorieIntake;
}

//Endpoint to get the badges state for a user.
router.get('/badges', checkAuthToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ ok: false, message: 'User not found' });
        }

        //Retrieve user-specific goal values
        const maxCalorieIntake = 20000;
        const goalSleep = user.goalSleep || 60; //Assuming a default if not set
        const goalSteps = user.goalSteps || 75000; //Assuming a default if not set
        const goalWater = user.goalWater || 40000; //Assuming a default if not set

        const badges = {
            calorieIntake: user.calorieIntake.some(ci => ci.calorieIntake >= maxCalorieIntake),
            sleep: user.sleep.some(s => s.durationInHrs >= goalSleep),
            steps: user.steps.some(s => s.steps >= goalSteps),
            water: user.water.some(w => w.amountInMilliliters >= goalWater)
        };

        res.json({ ok: true, badges });
    } catch (error) {
        console.error('Failed to fetch badges', error);
        res.status(500).json({ ok: false, message: 'Internal server error' });
    }
});

module.exports = router;
