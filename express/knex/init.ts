const Knex = require('knex');
const init = require('../config').database;
const {Model, knexSnakeCaseMappers} = require('objection');

// DB Columns 駝峰轉換
// 參考資料 : https://vincit.github.io/objection.js/recipes/snake-case-to-camel-case-conversion.html
const newKnexConfig = {
    ...init,

    // If your columns are UPPER_SNAKE_CASE you can use
    // ...knexSnakeCaseMappers({ upperCase: false })
};

// Initialize knex.
const knex = Knex(newKnexConfig);

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

