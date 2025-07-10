import { Calendar } from 'lucide-react';
import React from 'react'

export default function CalenderPage() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calendar</h2>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Calendar view would be implemented here</p>
            </div>
        </div>
    );
}
