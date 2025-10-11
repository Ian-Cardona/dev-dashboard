import RegisterForm from '../features/register/components/RegisterForm';
import { UserPlusIcon } from '@heroicons/react/24/outline';

// const RegisterPage = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center px-4">
//       <div className="w-full max-w-md rounded-lg p-6 shadow">
//         <h1 className="font-inter mb-6 text-center text-4xl font-bold sm:text-5xl">
//           Register
//         </h1>
//         <RegisterForm />
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-8">
      <div className="w-full max-w-md">
        <header className="mb-4 flex items-center justify-center gap-2">
          <UserPlusIcon className="h-8 w-8" />
          <h1 className="text-4xl">Create Account</h1>
        </header>
        <section className="relative flex flex-col rounded-2xl border bg-[var(--color-surface)] p-8">
          <RegisterForm />
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
