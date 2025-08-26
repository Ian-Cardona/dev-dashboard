'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.rawTodoSchema =
  exports.OtherTodoTypeEnum =
  exports.PredefinedTodoTypeEnum =
    void 0;
const zod_1 = __importDefault(require('zod'));
exports.PredefinedTodoTypeEnum = zod_1.default.enum([
  'TODO',
  'FIXME',
  'HACK',
  'NOTE',
  'BUG',
  'XXX',
]);
exports.OtherTodoTypeEnum = zod_1.default.literal('OTHER');
const rawUndefinedTodoBaseSchema = zod_1.default.object({
  type: zod_1.default.string(),
  content: zod_1.default.string(),
  filePath: zod_1.default.string(),
  lineNumber: zod_1.default.number(),
});
const rawPredefinedTodoSchema = rawUndefinedTodoBaseSchema.extend({
  type: exports.PredefinedTodoTypeEnum,
  customTag: zod_1.default.undefined().optional(),
});
const rawOtherTodoSchema = rawUndefinedTodoBaseSchema.extend({
  type: zod_1.default.literal('OTHER'),
  customTag: zod_1.default.string(),
});
exports.rawTodoSchema = zod_1.default.discriminatedUnion('type', [
  rawPredefinedTodoSchema,
  rawOtherTodoSchema,
]);
