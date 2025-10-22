import React, { useEffect } from 'react';

interface SchemaProps {
    data: object;
}

const SCHEMA_SCRIPT_ID = 'app-schema';

const Schema: React.FC<SchemaProps> = ({ data }) => {
    useEffect(() => {
        // Find existing schema script
        // FIX: Cast the result of document.getElementById to HTMLScriptElement.
        // The original code inferred the type as HTMLElement, which does not have a 'type' property, causing a TypeScript error.
        let script = document.getElementById(SCHEMA_SCRIPT_ID) as HTMLScriptElement | null;

        // If it doesn't exist, create it
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = SCHEMA_SCRIPT_ID;
            document.head.appendChild(script);
        }

        // Update its content
        script.textContent = JSON.stringify(data, null, 2);
        
    }, [data]);

    return null; // This component does not render anything
};

export default Schema;
