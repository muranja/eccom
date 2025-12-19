import React from 'react';

interface SpecItem {
    key: string;
    value: string;
}

interface TechSpecsTableProps {
    specs: SpecItem[];
}

export const TechSpecsTable: React.FC<TechSpecsTableProps> = ({ specs }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 my-8">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Feature
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Specification
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {specs.map((spec, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {spec.key}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {spec.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
