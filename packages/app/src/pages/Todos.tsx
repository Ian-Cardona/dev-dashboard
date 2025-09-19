import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { LatestTodos } from '../features/dashboard/todos/components/LatestTodos';
import { MainTodos } from '../features/dashboard/todos/components/MainTodos';

const TodosPage = () => {
  return (
    <div className="flex h-screen flex-col p-8">
      <header className="flex flex-shrink-0 items-center gap-3 pl-8">
        <DocumentTextIcon className="h-7 w-7" />
        <h1 className="text-4xl">Todos</h1>
      </header>
      <div className="grid grid-cols-2 grid-rows-2 gap-8 h-screen p-8">
        <LatestTodos />

        <section className="row-span-2">
          <MainTodos />
        </section>

        <section className="p-8 border rounded-4xl">
          Bottom Left Content
        </section>
      </div>
    </div>
  );
};

export default TodosPage;
