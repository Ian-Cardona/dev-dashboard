'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.todosApi = void 0;
const api_1 = require('./api');
exports.todosApi = {
  syncTodos: async todos => {
    const response = await api_1.protectedClient.post('/todos/sync', { todos });
    return response.data;
  },
};
//# sourceMappingURL=todosApi.js.map
