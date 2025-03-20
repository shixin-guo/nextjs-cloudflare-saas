'use client';

import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Greeting {
  id: string;
  greeting: string;
}

export function TrpcExample() {
  const [name, setName] = useState('');
  const getGreetings = trpc.hello.getGreetings.useQuery();
  const helloQuery = trpc.hello.hello.useQuery(
    { name },
    { enabled: false } // Don't run automatically
  );

  const submit = async() => {
    await helloQuery.refetch();
    await getGreetings.refetch();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-bold">tRPC Example</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="rounded-md border px-3 py-2"
        />
        <Button onClick={submit}>Submit</Button>
      </div>
      
      
      {helloQuery.isFetched && !helloQuery.isLoading && !helloQuery.error && helloQuery.data?.result && (
        <div className="mt-4">
          <p className="text-lg">Response: {JSON.stringify(helloQuery.data.result)}</p>
        </div>
      )}

      {getGreetings.isLoading ? (
        <p>Loading...</p>
      ) : getGreetings.error ? (
        <p className="text-red-500">Error: {getGreetings.error.message}</p>
      ) : (
        (getGreetings.data.result.map((i: Greeting) => {
          return <p className="text-lg" key={i.id}>{i.greeting}</p>
        }))
      )}
    </div>
  );
} 