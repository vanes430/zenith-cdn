'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Konfigurasi yang dapat diatur
const CONFIG = {
  title: 'File Explorer', // Judul header
  copyrightText: '© 2025 Your Company Name. All rights reserved.', // Teks copyright
  folderIcon: '📁', // Ikon untuk folder
  fileIcon: '📄', // Ikon untuk file
  darkModeByDefault: true, // Mode awal (true = dark, false = light)
};

const FileExplorer = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(CONFIG.darkModeByDefault);

  // Pastikan class .dark atau .light diterapkan saat pertama kali dimuat
  useEffect(() => {
    document.documentElement.classList.toggle('dark', CONFIG.darkModeByDefault);
    document.documentElement.classList.toggle('light', !CONFIG.darkModeByDefault);
  }, []);

  // Function to toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle('dark', newMode);
      document.documentElement.classList.toggle('light', !newMode);
      return newMode;
    });
  };

  const fetchFiles = async (folder: string) => {
    try {
      const res = await fetch(`/api/files?folder=${folder}`);
      if (!res.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await res.json();
      setFiles(data);
      setCurrentFolder(folder);
      setSelectedFileContent(null);
    } catch (error) {
      setError('Error fetching files');
    }
  };

  useEffect(() => {
    fetchFiles('');
  }, []);

  const handleFolderChange = (folder: string) => {
    fetchFiles(folder);
  };

  const handleBackToRoot = () => {
    fetchFiles('');
  };

  const handleBackToParent = () => {
    const parentFolder = currentFolder.split('/').slice(0, -1).join('/');
    fetchFiles(parentFolder);
  };

  const handleViewRawFile = async (file: string) => {
    try {
      const res = await fetch(`/api/files?folder=${currentFolder}&file=${file}`);
      if (!res.ok) {
        throw new Error('Failed to fetch file content');
      }
      const data = await res.json();
      setSelectedFileContent(data.content);
    } catch (error) {
      setError('Error fetching file content');
    }
  };

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <header>
        <h1>{CONFIG.title}</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>
      <main>
        <h2>Files in folder: {currentFolder || 'Root'}</h2>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <div>
            <div className="button-group">
              <button onClick={handleBackToRoot}>Root</button>
              {currentFolder && (
                <button onClick={handleBackToParent}>parent..</button>
              )}
            </div>
            <table className="file-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size (Bytes)</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={index} className="file-row">
                    <td>
                      <span className={file.isDirectory ? 'folder-icon' : 'file-icon'}>
                        {file.name}
                      </span>
                    </td>
                    <td>{file.size}</td>
                    <td>{new Date(file.lastModified).toLocaleString()}</td>
                    <td>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedFileContent && (
              <div className="file-content">
                <h3>File Content:</h3>
                <pre>{selectedFileContent}</pre>
              </div>
            )}
          </div>
        )}
      </main>
      <footer>
        <p className="copyright">{CONFIG.copyrightText}</p>
      </footer>
    </div>
  );
};

export default FileExplorer;