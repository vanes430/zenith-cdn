'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const FileExplorer = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default dark mode is true

  // Function to toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchFiles = async (folder: string) => {
    try {
      const res = await fetch(`/api/files?folder=${folder}`);
      if (!res.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await res.json();
      setFiles(data);
      setCurrentFolder(folder); // Menyimpan folder saat ini
      setSelectedFileContent(null); // Reset isi file saat folder berubah
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

  const handleViewRawFile = async (file: string) => {
    try {
      const res = await fetch(`/api/files?folder=${currentFolder}&file=${file}`);
      if (!res.ok) {
        throw new Error('Failed to fetch file content');
      }
      const data = await res.json();
      setSelectedFileContent(data.content); // Menyimpan isi file
    } catch (error) {
      setError('Error fetching file content');
    }
  };

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <header>
        <h1>File Explorer</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>
      <h2>Files in folder: {currentFolder || 'Root'}</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <div className="button-group">
            <button onClick={handleBackToRoot}>Back to Root</button>
            {currentFolder && (
              <button onClick={handleBackToParent}>Back to Parent Folder</button>
            )}
          </div>
          <div className="file-list">
            <div className="table-header">
              <div>Name</div>
              <div>Size (Bytes)</div>
              <div>Last Modified</div>
              <div>Actions</div>
            </div>
            <div className="file-items">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div>{file.name}</div>
                  <div>{file.size}</div>
                  <div>{new Date(file.lastModified).toLocaleString()}</div>
                  <div className="actions">
                    {file.isDirectory ? (
                      <button onClick={() => handleFolderChange(file.name)}>
                        Open Folder
                      </button>
                    ) : (
                      <Link href={`/${currentFolder ? `${currentFolder}/` : ''}${file.name}`}>
                        <button onClick={() => handleViewRawFile(file.name)}>
                          View Raw File
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedFileContent && (
            <div className="file-content">
              <h3>File Content:</h3>
              <pre>{selectedFileContent}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;