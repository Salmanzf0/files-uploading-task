/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { RxCross2 } from "react-icons/rx";
import { app } from '../utils/firebase.js';
import { baseUrl } from '../utils/baseUrl.js';

const FileUploadModal = ({ showModal, toggleModal, onUploadComplete }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                alert("Only image files (jpg, jpeg, png), PDF files, and document files (doc) are allowed.");
                return;
            }
            const newFiles = acceptedFiles.filter(file => !files.some(existingFile => existingFile.name === file.name));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        },
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'application/pdf': ['.pdf'],
        }
    });

    const uploadFiles = async () => {
        setUploading(true);
        try {
            const fileData = await Promise.all(
                files.map(async (file) => {
                    const url = await uploadFileToFirebase(file);
                    const fileExtension = file.name.split('.').pop().toLowerCase();
                    const fileType = getFileType(fileExtension);

                    return {
                        name: file.name,
                        url,
                        type: fileType,
                    };
                })
            );

            await axios.post(`${baseUrl}/file/upload`, { files: fileData });
            setUploading(false);
            setFiles([]);
            toggleModal();
            onUploadComplete();
        } catch (err) {
            console.error('Error uploading files:', err);
            setUploading(false);
        }
    };

    const uploadFileToFirebase = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = file.name;
            const storageRef = ref(storage, `files/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Uploading ${file.name}: ${progress}%`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const getFileType = (fileExtension) => {
        const imageExtensions = ['jpg', 'jpeg', 'png'];
        const pdfExtension = ['pdf'];
        const docExtensions = ['doc', 'docx'];

        if (imageExtensions.includes(fileExtension)) {
            return 'image';
        } else if (pdfExtension.includes(fileExtension)) {
            return 'pdf';
        } else if (docExtensions.includes(fileExtension)) {
            return 'doc';
        } else {
            return 'other';
        }
    };

    const removeFile = (event, fileIndex) => {
        event.stopPropagation();
        const updatedFiles = [...files];
        updatedFiles.splice(fileIndex, 1);
        setFiles(updatedFiles);
    };

    const closeModal = () => {
        toggleModal();
        setFiles([]);
    }
    

    return (

        <div
            className={`fixed z-10 inset-0 overflow-y-auto ${showModal ? 'block' : 'hidden'
                }`}
        >
            <div className="flex items-center justify-center min-h-screen bg-gray-500 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 min-w-[50%] ">
                    <h2 className="text-lg font-bold mb-4">Upload Files</h2>
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-400 p-8 rounded-md cursor-pointer mb-4"
                    >
                        <input
                            {...getInputProps()}
                            multiple
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,.doc"
                            onClick={(e) => e.stopPropagation()}
                        />
                        {files.length > 0 ? (
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center gap-4" onClick={(event) => event.stopPropagation()} >
                                        <span>{file.name}</span>
                                        <button
                                            onClick={(event) => removeFile(event, index)}
                                            disabled={uploading}
                                            className="text-black text-2xl font-bold rounded"
                                        >
                                            <RxCross2 />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Drag and drop files here, or click to select files</p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={closeModal}
                            disabled={uploading}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={uploadFiles}
                            disabled={files.length === 0 || uploading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default FileUploadModal;




