import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

interface ProsConsProps {
    pros: string[];
    cons: string[];
}

export const ProsCons: React.FC<ProsConsProps> = ({ pros, cons }) => {
    return (
        <div className="grid md:grid-cols-2 gap-6 my-8">
            {/* Pros Column */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                <h3 className="text-emerald-800 font-bold mb-4 flex items-center gap-2">
                    <span className="bg-emerald-200 p-1 rounded-full text-emerald-700">
                        <FiCheck />
                    </span>
                    Reasons to Buy
                </h3>
                <ul className="space-y-3">
                    {pros.map((pro, index) => (
                        <li key={index} className="flex gap-3 text-sm text-slate-700">
                            <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                            <span>{pro}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Cons Column */}
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
                <h3 className="text-rose-800 font-bold mb-4 flex items-center gap-2">
                    <span className="bg-rose-200 p-1 rounded-full text-rose-700">
                        <FiX />
                    </span>
                    Reasons to Avoid
                </h3>
                <ul className="space-y-3">
                    {cons.map((con, index) => (
                        <li key={index} className="flex gap-3 text-sm text-slate-700">
                            <span className="text-rose-500 flex-shrink-0 mt-0.5">✕</span>
                            <span>{con}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
