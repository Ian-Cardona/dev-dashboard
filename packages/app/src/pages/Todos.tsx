import { DocumentTextIcon } from '@heroicons/react/24/outline';
import PendingResolutions from '../features/todos/components/PendingResolutions';
import TodosHistory from '../features/todos/components/TodosHistory';

const TodosPage = () => {
  return (
    <div className="h-screen flex flex-col p-8 overflow-hidden">
      <header className="flex flex-shrink-0 items-center gap-3 mb-8">
        <DocumentTextIcon className="h-7 w-7" />
        <h1 className="text-4xl">Todos</h1>
      </header>
      <div className="grid grid-cols-2 grid-rows-2 gap-8 flex-1 min-h-0">
        <div className="min-h-0 overflow-hidden">
          <PendingResolutions />
        </div>

        <div className="row-span-2 min-h-0 overflow-hidden">
          <TodosHistory />
        </div>

        <div className="p-8 border rounded-4xl min-h-0 overflow-auto">
          Bottom Left Content
        </div>
      </div>
    </div>
  );
};

export default TodosPage;
