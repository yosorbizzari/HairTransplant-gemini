
import React from 'react';

interface ImageInputProps {
    label: string;
    currentImageUrl: string;
    onImageUrlChange: (url: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, currentImageUrl, onImageUrlChange }) => {
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onImageUrlChange(e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUrlChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <input
                    type="text"
                    value={currentImageUrl.startsWith('data:') ? '' : currentImageUrl}
                    onChange={handleUrlChange}
                    placeholder="Paste Image URL"
                    className="p-2 border rounded w-full flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">OR</span>
                    <label className="cursor-pointer px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap">
                        Upload File
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                </div>
            </div>
            {currentImageUrl && (
                 <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Image Preview:</p>
                    <img src={currentImageUrl} alt="Preview" className="mt-2 rounded-lg border max-h-40 object-contain bg-gray-50" />
                </div>
            )}
        </div>
    );
};

export default ImageInput;