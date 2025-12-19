import React from 'react';

interface PricePoint {
    date: string;
    price: number;
}

interface PriceHistoryProps {
    history?: PricePoint[];
}

export const PriceHistory: React.FC<PriceHistoryProps> = ({ history }) => {
    // Default mock data if none provided
    const data = history || [
        { date: '2023-10-01', price: 95000 },
        { date: '2023-11-01', price: 92000 },
        { date: '2023-12-01', price: 89999 },
        { date: '2024-01-01', price: 88500 },
    ];

    const maxPrice = Math.max(...data.map(d => d.price));
    const minPrice = Math.min(...data.map(d => d.price));

    return (
        <div className="my-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>📈</span> Price History
            </h3>

            <div className="space-y-3">
                {data.map((point, index) => {
                    const width = ((point.price - minPrice * 0.9) / (maxPrice - minPrice * 0.9)) * 100;
                    return (
                        <div key={index} className="flex items-center gap-3 text-sm">
                            <span className="w-24 text-gray-500">{point.date}</span>
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${width}%` }}
                                />
                            </div>
                            <span className="w-20 font-bold text-slate-700">
                                KES {point.price.toLocaleString()}
                            </span>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
                * Prices are subject to change based on market availability.
            </p>
        </div>
    );
};
