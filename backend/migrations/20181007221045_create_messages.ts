import * as Knex from "knex";

exports.up = async (knex: Knex) => {
  console.log('creating comments table...');
  await knex.schema.createTable('comments', builder => {
    builder.increments('id').unsigned().primary().notNullable();
    builder.text('contents').notNullable();
    builder.text('url').notNullable();
    builder.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    builder.integer('votes').notNullable().defaultTo(1);
    builder.integer('parentId').references('comments.id').nullable();
  });
};

exports.down = async (knex: Knex) => {
  await knex.schema.dropTable('comments');
};
