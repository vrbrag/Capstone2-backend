// const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {title: 'Chicken Soup', notes: Spicy} =>
 *   { setCols: '"title"=$1, "notes"=$2',
 *     values: ['Chicken Soup', Spicy] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
   const keys = Object.keys(dataToUpdate);
   if (keys.length === 0) throw new BadRequestError("No data");

   const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
   );

   return {
      setCols: cols.join(", "),
      values: Object.values(dataToUpdate),
   };
}

module.exports = { sqlForPartialUpdate };
