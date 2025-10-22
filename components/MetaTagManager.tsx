import React, { useEffect } from 'react';

interface MetaTagManagerProps {
    title: string;
    description: string;
}

const MetaTagManager: React.FC<MetaTagManagerProps> = ({ title, description }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        // Remove existing description meta tag if it exists
        const existingMetaTag = document.querySelector('meta[name="description"]');
        if (existingMetaTag) {
            existingMetaTag.remove();
        }

        // Add new description meta tag
        if (description) {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description;
            document.head.appendChild(meta);
        }
    }, [title, description]);

    return null; // This component does not render anything
};

export default MetaTagManager;
