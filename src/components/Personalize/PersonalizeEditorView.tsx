import { IPersonalizeCreateArgs } from '@/app/chat/page';
import { PanelRightClose } from 'lucide-react';
import { FC, useState } from 'react';
import { z } from 'zod';
import { Button } from '../ui/button';

interface PersonalizeEditorViewProps {
  results: IPersonalizeCreateArgs | undefined;
  toggleEditor: () => void;
}

const resultsSchema = z.object({
  assets: z.object({
    html: z.string(),
    css: z.string(),
    js: z.string(),
  }),
  //templateVars: z.record(z.string(), z.string()),
});

export const PersonalizeEditorView: FC<PersonalizeEditorViewProps> = ({ results, toggleEditor }) => {
  const [validatedResults, setValidatedResults] = useState(() => {
    const parsedResults = resultsSchema.safeParse(results);
    return parsedResults.success ? parsedResults.data : { assets: { html: '', css: '', js: '' } };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: string) => {
    setValidatedResults((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="editor-view fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg">
      <div className="p-4 relative h-full flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Editor View</h2>
          <textarea
            className="w-full h-24 p-2 border rounded"
            value={validatedResults.assets.html}
            onChange={(e) => handleInputChange(e, 'assets.html')}
          />
          <textarea
            className="w-full h-24 p-2 border rounded"
            value={validatedResults.assets.css}
            onChange={(e) => handleInputChange(e, 'assets.css')}
          />
          <textarea
            className="w-full h-24 p-2 border rounded"
            value={validatedResults.assets.js}
            onChange={(e) => handleInputChange(e, 'assets.js')}
          />
          <div className="flex justify-end">
            <Button className="mt-4 px-4 py-2 rounded-lg border bg-gray-700 text-white">Update</Button>
          </div>
        </div>
        <div className="flex justify-start">
          <Button onClick={toggleEditor} className="p-2 text-white bg-gray-700 border">
            <PanelRightClose className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
