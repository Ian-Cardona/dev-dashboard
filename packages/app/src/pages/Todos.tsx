import { LatestTodos } from '../features/dashboard/todos/components/LatestTodos';
import { MainTodos } from '../features/dashboard/todos/components/MainTodos';

const TodosPage = () => {
  return (
    <div>
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
