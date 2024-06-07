import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import { IoMdOpen } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import FileUploadModal from './FileUploadModal';
import { baseUrl } from '../utils/baseUrl';

const Files = () => {
    const [files, setFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${baseUrl}/file/all`);
            setFiles(response.data);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUploadComplete = () => {
        fetchFiles();
    };

    const openFile = (file) => {
        const fileId = file._id;
        const fileUrl = file.url;

        if (file.type === 'image') {
            navigate(`/files/${fileId}`);
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
        files.forEach((file) => {
            const fileId = file._id;
            const fileUrl = file.url;

            if (file.type === 'image') {
                window.open(`/files/${fileId}`, '_blank');
            } else if (file.type === 'pdf' || file.type === 'doc') {
                window.open(`${fileUrl}`, '_blank');
            } else {
                window.alert('File type not supported for preview');
            }
        });
    };


    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between mb-4">
                <button
                    onClick={openAllFiles}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Open All
                </button>
                <button
                    onClick={toggleModal}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Upload
                </button>
            </div>
            <FileUploadModal showModal={showModal} toggleModal={toggleModal} onUploadComplete={handleUploadComplete} />
            <ul className='flex flex-col flex-wrap w-full items-center justify-center'>
                {files.map((file) => (
                    <li
                        key={file._id}
                        className="flex justify-between items-center bg-gray-100 p-4 w-3/4 rounded-lg mb-2"
                    >
                        <div className="flex items-center">
                            {file.type === "pdf" ? (
                                <FaRegFilePdf className="w-10 h-10 mr-4 object-cover rounded" />
                            ) : (
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-10 h-10 mr-4 object-cover rounded"
                                />
                            )}

                            <span>{file.name}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <button
                                onClick={() => openFile(file)}
                                className="text-black font-bold  text-2xl rounded"
                            >
                                <IoMdOpen />
                            </button>
                            <button
                                onClick={() => removeFile(file._id)}
                                className="text-black font-bold  text-2xl rounded"
                            >
                                <MdDeleteOutline />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Files;