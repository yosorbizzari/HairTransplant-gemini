import React from 'react';
import { Breadcrumb, View } from '../types';

interface BreadcrumbsProps {
    crumbs: Breadcrumb[];
    setView: (view: View) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs, setView }) => {
    if (!crumbs || crumbs.length <= 1) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className="bg-gray-100">
            <ol className="container mx-auto px-6 py-3 flex items-center space-x-2 text-sm text-gray-500">
                {crumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setView(crumb.view);
                            }}
                            className={`
                                ${index === crumbs.length - 1 
                                    ? 'font-semibold text-gray-700' 
                                    : 'hover:text-gray-700 hover:underline'
                                }
                            `}
                            aria-current={index === crumbs.length - 1 ? 'page' : undefined}
                        >
                            {crumb.name}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
