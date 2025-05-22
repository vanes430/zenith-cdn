// app/[folder]/[file].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const FileViewer = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { folder, file } = router.query;

  useEffect(() => {
    if (folder && file) {
      const fetchFileContent = async () => {
        try {
          const res = await fetch(`/api/files?folder=${folder}&file=${file}`);
          if (!res.ok) {
            throw new Error('Failed to fetch file content');
          }
          const data = await res.json();
          setFileContent(data.content); // Menyimpan isi file
        } catch (error) {
          setError('Error fetching file content');
        }
      };
      fetchFileContent();
    }
  }, [folder, file]);

  return (
    <div>
      <h1>File: {file}</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h3>File Content:</h3>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default FileViewer;
