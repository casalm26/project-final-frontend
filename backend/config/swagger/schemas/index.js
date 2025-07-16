import { userSchema } from './user.js';
import { forestSchema } from './forest.js';
import { treeSchema } from './tree.js';
import { errorSchema, successResponseSchema } from './common.js';

export const schemas = {
  User: userSchema,
  Forest: forestSchema,
  Tree: treeSchema,
  Error: errorSchema,
  SuccessResponse: successResponseSchema
};