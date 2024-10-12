import { ClientList } from '@/components/Clients/ClientList';

export default function Settings() {
  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl">Settings</h1>
        <p className="text-medium mb-4">Configure your Sitecore connection client.</p>

        <ClientList />
      </div>
    </>
  );
}
