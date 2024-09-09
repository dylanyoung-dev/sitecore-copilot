'use client';
import { Welcome } from '@/components/Welcome/Welcome';
import { useClientContext } from '@/context/ClientContext';

export default function Home() {
  const { clients } = useClientContext();
  return (
    <>
      {!clients || clients.length === 0 ? (
        <Welcome />
      ) : (
        <>Show Personalization Information</>
      )}
    </>
  );
}
