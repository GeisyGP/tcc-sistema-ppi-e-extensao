import { Suspense } from 'react';
import LoginForm from '../../../components/login-form';

export default function LoginPage() {
  return (
    <main className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-green-700 p-6 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white tracking-wide m-0">SIPPIE</h1>
      </div>
      <div className="p-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
