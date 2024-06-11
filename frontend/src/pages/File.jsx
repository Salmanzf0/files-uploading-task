import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';

const File = () => {
    const { id } = useParams();
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await axios.get(`${baseUrl}/file/get/${id}`);
                setFile(response.data);
            } catch (err) {
                console.error('Error fetching file:', err);
            }
        };

        fetchFile();
    }, [id]);

    const handleDownload = async () => {
        if (file && file.url) {
            try {
                const response = await axios.get(file.url, {
                    responseType: 'blob',
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.setAttribute('download', file.name);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Error downloading file:', err);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 h-[100vh] flex items-center justify-center">
            {file && file.type === 'image' ? (
                <div className="flex flex-col items-center ">
                    <img src={file.url} alt="File" className="max-w-full h-[70vh]" />
                    <button
                        onClick={handleDownload}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Download
                    </button>
                </div>
            ) : (
                <div className="text-center">Loading...</div>
            )}
        </div>
    );
};

export default File;