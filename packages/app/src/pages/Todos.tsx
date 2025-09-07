import { LatestTodos } from '../features/dashboard/todos/components/LatestTodos';
import { MainTodos } from '../features/dashboard/todos/components/MainTodos';

const TodosPage = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 grid-rows-2 gap-4 h-screen">
        <LatestTodos />

        <section className="row-span-2">
          <MainTodos />
        </section>

        <section className="p-2 border rounded-4xl">
          Bottom Left Content
        </section>
      </div>
    </div>
  );
};

export default TodosPage;
