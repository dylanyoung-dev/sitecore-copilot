import { Button } from '../ui/button';

export const Welcome = () => {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Welcome to Sitecore Assistant</h2>
      <p className="text-lg font-semibold mb-4">
        This app is disabled until you configure a Sitecore connection client. To get started click here:
      </p>
      <Button className="ml-2">Sitecore Configuration</Button>
    </>
  );
};
