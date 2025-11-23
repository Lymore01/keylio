'use client';
import { useEffect } from 'react';
import { signOut } from '../../../../packages/react/src/methods';
import { getToken } from '../../../../packages/react/src/utils/getToken';

export default function Protected() {
  useEffect(() => {
    async function func() {
      const token = await getToken();
      return token;
    }
    func().then((data) => {
      console.log(data);
    });
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div>
          <h1 className="text-black">Protected Page</h1>
          <button
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md
                       hover:bg-red-700 focus:outline-none focus:ring-2
                       focus:ring-red-500 focus:ring-offset-2"
            onClick={async () => {
              await signOut();
              window.location.reload();
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
