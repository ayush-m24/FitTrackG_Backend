/*const User = require('../Models/UserSchema');

const awardBadge = async (userId, category, goal, currentValue) => {
    const user = await User.findById(userId);
    if (currentValue >= goal && !user.badges.some(badge => badge.category === category && badge.dateAwarded.toDateString() === new Date().toDateString())) {
        user.badges.push({
            category: category,
            dateAwarded: new Date(),
            image: `/public/images/${category.toLowerCase()}-badge.png`
        });
        await user.save();
    }
};

module.exports = {
    awardBadge
};
*/

const User = require('../Models/UserSchema');

// Utility function to award badges
async function awardBadge(userId, category, currentValue) {
    const user = await User.findById(userId);
    if (!user) return;

    const goals = {
        "Calorie Intake": user.maxCalorieIntake,
        "Sleep": user.goalSleep,
        "Steps": user.goalSteps,
        "Water": user.goalWater
    };

    const badgePaths = {
        "Calorie Intake": "/images/calorieIntake.png",
        "Sleep": "/images/sleep.png",
        "Steps": "/images/steps.png",
        "Water": "/images/water.png"
    };

    // Check if the user met the goal and if they haven't already received the badge today
    if (currentValue >= goals[category] && !user.badges.find(badge => badge.category === category && new Date(badge.dateAwarded).toDateString() === new Date().toDateString())) {
        user.badges.push({
            category: category,
            dateAwarded: new Date(),
            imagePath: badgePaths[category]
        });
        await user.save();
    }
}

module.exports = {
    awardBadge
};


/*
async function awardBadge(userId, category, currentValue) {
    const user = await User.findById(userId);
    if (!user) return;

    const goals = {
        "Calorie Intake": user.maxCalorieIntake,
        "Sleep": user.goalSleep,
        "Steps": user.goalSteps,
        "Water": user.goalWater
    };

    // Logging for debugging
    console.log(`Current Value: ${currentValue}, Goal for ${category}: ${goals[category]}`);

    // Check for undefined goal and log error if not set
    if (goals[category] === undefined) {
        console.error(`Goal for ${category} is undefined. Please check the user setup.`);
        return; // Exit if the goal is undefined
    }

    if (currentValue >= goals[category]) {
        const alreadyAwarded = user.badges.find(badge => 
            badge.category === category && 
            new Date(badge.dateAwarded).toDateString() === new Date().toDateString()
        );

        if (!alreadyAwarded) {
            user.badges.push({
                category: category,
                dateAwarded: new Date(),
                imagePath: `/images/${category.toLowerCase()}.png`
            });
            await user.save();
            console.log('Badge awarded successfully');
        } else {
            console.log(`${category} badge already awarded today.`);
        }
    } else {
        console.log(`${category} goal not met.`);
    }
}


module.exports = {
    awardBadge
}; */