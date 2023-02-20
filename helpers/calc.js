/** Calculate user's daily calorie intake */

// pal => physical activity level
//    1.2 is for little or no exercise;
//    1.4 is for light exercise 1-2 times a week;
//    1.6 is for moderate exercise 2-3 times/week;
//    1.75 is for hard exercise 3-5 times/week;
//    2.0 if you've got a physical job or perform hard exercise 6-7 times/week; and
//    2.4 is for professional athletes.

// weight (lbs) -> (kg)
// height (in) -> (cm)
// age (years)


/** Calculate TDEE = total daily energy expenditure */

function calcTDEE(age, weight, height, gender, pal) {
   let BMR = (10 * weight * 0.453592) + (6.25 * height * 2.54) - (5 * age);

   if (gender === "male") {
      BMR = BMR + 5     // (kcal/day)
   };
   if (gender === "female") {
      BMR = BMR - 161    // (kcal/day)
   };
   TDEE = BMR * pal;     // (kcal/day)

   return TDEE;
};

function calcDailyCal(weight, height, age, gender, pal, goal_weight) {

   let daily_cal = parseFloat(calcTDEE(weight, height, age, gender, pal)).toFixed(2)
   // let daily_cal = calcTDEE(weight, height, age, gender, pal);

   // offset daily calorie intake by 500 cals
   // depending on goal_weight
   if (goal_weight === "lose") daily_cal - 500;
   if (goal_weight === "gain") daily_cal + 500;

   return daily_cal;    //kcal
};

module.exports = { calcDailyCal, calcTDEE }