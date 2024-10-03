import hljs from 'highlight.js/lib/core';

import { useEffect, useRef } from 'react';

import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import plainText from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('python', python);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('plaintext', plainText);

const supportedLanguages = ['javascript', 'typescript', 'html', 'css', 'python', 'json', 'bash'];

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      const lang = supportedLanguages.includes(language) ? language : 'plaintext';
      const highlightedCode = hljs.highlight(code, { language: lang }).value;
      codeRef.current.innerHTML = highlightedCode;
    }
  }, [code, language]);

  return (
    <code ref={codeRef} className={`language-${language}`}>
      {code}
    </code>
  );
};
