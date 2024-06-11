import { useState, useEffect } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const MultiFileViewer = () => {
    const [files, setFiles] = useState([]);
    const [activeFiles, setActiveFiles] = useState([]);

    useEffect(() => {
        const urlFiles = JSON.parse(localStorage.getItem('files'));
        if (urlFiles && urlFiles.length > 0) {
            setFiles(urlFiles);
            setActiveFiles([urlFiles[0]]);
        }
    }, []);

    const openFile = (file) => {
        if (!activeFiles.some(f => f._id === file._id)) {
            if (activeFiles.length < 3) {
                setActiveFiles([...activeFiles, file]);
            }
            else {
                setActiveFiles([activeFiles[0], activeFiles[1], file]);
            }
        }
    };

    const updateLocalStorage = (updatedFiles) => {
        localStorage.setItem('files', JSON.stringify(updatedFiles));
    };

    const closeFile = (fileToClose, event) => {
        event.stopPropagation();
        const newActiveFiles = activeFiles.filter(file => file._id !== fileToClose._id);
        setActiveFiles(newActiveFiles.length > 0 ? newActiveFiles : []);

        const newFiles = files.filter(file => file._id !== fileToClose._id);
        setFiles(newFiles);
        updateLocalStorage(newFiles);

        if (newActiveFiles.length === 0 && newFiles.length > 0) {
            setActiveFiles([newFiles[newFiles.length - 1]]);
        }

        if (newActiveFiles.length === 0 && newFiles.length === 0) {
            window.close();
        }
    };

    const renderFileViewer = (file) => {
        if (file.type === 'image') {
            return <img src={file.url} alt={file.name} className="w-full h-full object-contain" />;
        } else if (file.type === 'pdf') {
            return <iframe src={`${file.url}#toolbar=0`} title={file.name} className="w-full h-full" />;
        } else {
            return <div className="flex items-center justify-center text-gray-500 text-2xl">Unsupported file type</div>;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <div className="bg-gray-200 p-2 flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent" style={{ whiteSpace: 'nowrap' }}>
                {files.map((file) => (
                    <motion.button
                        key={file._id}
                        onClick={() => openFile(file)}
                        className={`flex items-center px-4 py-2 rounded ${activeFiles.includes(file) ? 'bg-white text-gray-800' : 'bg-gray-300'}`}
                        style={{ height: '40px', minWidth: '150px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="font-semibold truncate">{file.name}</span>
                        {activeFiles.includes(file) && (
                            <IoCloseCircle
                                className="ml-2 flex-shrink-0 w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200"
                                onClick={(e) => closeFile(file, e)}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
            <div className="flex-grow flex p-4 space-x-4 overflow-hidden">
                <AnimatePresence>
                    {activeFiles.map((file) => (
                        <motion.div
                            key={file._id}
                            className="flex-1 bg-white rounded-lg shadow-xl overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-full h-full p-2 overflow-hidden">
                                {renderFileViewer(file)}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MultiFileViewer;
