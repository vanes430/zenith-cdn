// app/page.tsx

'use client';

import { useState, useEffect } from 'react';

const FileExplorer = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async (folder: string) => {
    try {
      const res = await fetch(`/api/files?folder=${folder}`);
      if (!res.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await res.json();
      setFiles(data);
      setCurrentFolder(folder); // Menyimpan folder saat ini
    } catch (error) {
      setError('Error fetching files');
    }
  };

  useEffect(() => {
    fetchFiles(''); // Mulai dengan folder root saat aplikasi dimuat
  }, []);

  const handleFolderChange = (folder: string) => {
    fetchFiles(folder); // Memuat folder yang dipilih
  };

  const handleBackToRoot = () => {
    fetchFiles(''); // Kembali ke folder root
  };

  const handleBackToParent = () => {
    const parentFolder = currentFolder.split('/').slice(0, -1).join('/');
    fetchFiles(parentFolder); // Kembali ke parent folder
  };

  return (
    <div>
      <h2>Files in folder: {currentFolder || 'Root'}</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <button onClick={handleBackToRoot}>Back to Root</button>
          {currentFolder && (
            <button onClick={handleBackToParent}>
              Back to Parent Folder ( : )
            </button>
          )}
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <strong>{file.name}</strong>
                <p>Size: {file.size} bytes</p>
                <p>Last Modified: {new Date(file.lastModified).toLocaleString()}</p>
                {file.isDirectory ? (
                  <button onClick={() => handleFolderChange(file.name)}>Open Folder</button>
                ) : (
                  <a href={file.rawUrl} target="_blank" rel="noopener noreferrer">
                    View Raw File
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
