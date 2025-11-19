"use client";
import { signOut } from "../../../../packages/react/src/methods";

export default function Protected() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div>
          <p className="text-black">Protected Page</p>
          <button
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md 
                       hover:bg-red-700 focus:outline-none focus:ring-2 
                       focus:ring-red-500 focus:ring-offset-2"
            onClick={async () => {
              await signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
