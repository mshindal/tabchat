import * as Knex from "knex";
import * as crypto from 'crypto';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);

const generateDeleteKey = async () => (await randomBytes(512)).toString('base64');

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable('comments', builder => {
    // add a deleteKey column, but make it nullable
    builder.text('deleteKey').nullable();
    // add an isDeleted column, but make it nullable
    builder.boolean('isDeleted').nullable();
  });
  // randomly generate a delete key
  const deleteKey = await generateDeleteKey();
  // for every comment with a null delete key (should be all of them),
  // set the delete key to be our randomly generated one
  await knex.update({
    deleteKey
  }).from('comments').where({
    deleteKey: null
  });
  // for every comment, set isDeleted to false
  await knex.update({
    isDeleted: false
  }).from('comments');
  await knex.schema.alterTable('comments', builder => {
    // make the deleteKey column non-nullable
    builder.text('deleteKey').notNullable().alter();
    // make the isDeleted column non-nullable, and default it to `false`
    builder.boolean('isDeleted').notNullable().defaultTo(false).alter();
  });
}


export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable('comments', builder => {
    builder.dropColumn('deleteKey');
    builder.dropColumn('isDeleted');
  });
}

