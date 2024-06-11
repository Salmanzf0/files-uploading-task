import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDeleteOutline } from "react-icons/md";
import { IoMdOpen } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import { motion } from 'framer-motion';

import FileUploadModal from '../components/FileUploadModal';
import { baseUrl } from '../utils/baseUrl';

const Files = () => {
    const [files, setFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${baseUrl}/file/all`);
            setFiles(response.data);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    };

    useEffect(() => {
        localStorage.removeItem('files');
        fetchFiles();
    }, []);

    const handleUploadComplete = () => {
        fetchFiles();
    };

    const openFile = (file) => {
        const fileId = file._id;
        const fileUrl = file.url;

        if (file.type === 'image') {
            window.open(`/files/${fileId}`);
        } else if (file.type === 'pdf' || file.type === 'doc') {
            window.open(`${fileUrl}`, '_blank');
        } else {
            window.alert('File type not supported for preview');
        }
    };

    const removeFile = async (fileId) => {
        try {
            await axios.delete(`${baseUrl}/file/delete/${fileId}`);
            setFiles(files.filter(file => file._id !== fileId));
        } catch (err) {
            console.error('Error removing file:', err);
        }
    };

    const openAllFiles = () => {
        localStorage.setItem('files', JSON.stringify(files));
        window.open('/viewer', '_blank');
    };


    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="container mx-auto p-8 bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Files</h1>
            <div className="flex justify-between mb-6">
                <motion.button
                    onClick={openAllFiles}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Open All Files
                </motion.button>
                <motion.button
                    onClick={toggleModal}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Upload New File
                </motion.button>
            </div>
            <FileUploadModal showModal={showModal} toggleModal={toggleModal} onUploadComplete={handleUploadComplete} />
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map((file) => (
                    <motion.li
                        key={file._id}
                        className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center mb-4">
                            {file.type === "pdf" ? (
                                <FaRegFilePdf className="w-16 h-16 text-red-500 mr-4" />
                            ) : (
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-16 h-16 object-cover rounded-lg shadow-md mr-4"
                                />
                            )}
                            <span className="text-xl font-semibold text-gray-800">{file.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <motion.button
                                onClick={() => openFile(file)}
                                className="text-blue-600 hover:text-blue-800 font-bold text-2xl transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IoMdOpen />
                            </motion.button>
                            <motion.button
                                onClick={() => removeFile(file._id)}
                                className="text-red-500 hover:text-red-700 font-bold text-2xl transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <MdDeleteOutline />
                            </motion.button>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
};

export default Files;