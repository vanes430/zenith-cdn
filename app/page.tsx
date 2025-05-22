'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Konfigurasi yang dapat diatur
const CONFIG = {
  title: 'File Explorer',
  copyrightText: '© 2025 Your Company Name. All rights reserved.',
  folderIcon: '📁',
  fileIcon: '📄',
  darkModeByDefault: true,
};

const FileExplorer = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(CONFIG.darkModeByDefault);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', CONFIG.darkModeByDefault);
    document.documentElement.classList.toggle('light', !CONFIG.darkModeByDefault);
  }, []);

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
      // Urutkan files: folder di atas, file di bawah
      const sortedFiles = data.sort((a: any, b: any) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name); // Urutkan berdasarkan nama jika sama-sama folder atau file
      });
      setFiles(sortedFiles);
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
              <button onClick={handleBackToRoot}>Back to Root</button>
              {currentFolder && (
                <button onClick={handleBackToParent}>Back to Parent Folder</button>
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
                      {file.isDirectory ? (
                        <span
                          className="folder-icon clickable"
                          onClick={() => handleFolderChange(file.name)}
                        >
                          {file.name}
                        </span>
                      ) : (
                        <span className="file-icon">{file.name}</span>
                      )}
                    </td>
                    <td>{file.size}</td>
                    <td>{new Date(file.lastModified).toLocaleString()}</td>
                    <td>
                      {!file.isDirectory && (
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