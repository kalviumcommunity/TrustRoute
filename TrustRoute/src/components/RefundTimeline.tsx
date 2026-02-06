import React from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface TimelineStage {
    stage: string;
    timestamp: string | null;
    status: 'completed' | 'current' | 'pending' | 'failed';
    description: string;
}

interface RefundTimelineProps {
    timeline: TimelineStage[];
}

const RefundTimeline: React.FC<RefundTimelineProps> = ({ timeline }) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'current':
                return <Clock className="w-6 h-6 text-blue-500 animate-pulse" />;
            case 'failed':
                return <XCircle className="w-6 h-6 text-red-500" />;
            default:
                return <AlertCircle className="w-6 h-6 text-gray-300" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'border-green-500 bg-green-50';
            case 'current':
                return 'border-blue-500 bg-blue-50';
            case 'failed':
                return 'border-red-500 bg-red-50';
            default:
                return 'border-gray-300 bg-gray-50';
        }
    };

    const formatTimestamp = (timestamp: string | null) => {
        if (!timestamp) return null;
        const date = new Date(timestamp);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Refund Progress Tracker</h3>

            <div className="relative">
                {timeline.map((stage, index) => (
                    <div key={index} className="flex gap-4 mb-8 last:mb-0">
                        {/* Timeline line */}
                        {index < timeline.length - 1 && (
                            <div className="absolute left-[14px] top-[40px] w-0.5 h-[calc(100%-80px)] bg-gray-200"
                                style={{
                                    top: `${40 + index * 100}px`,
                                    height: '60px',
                                    background: stage.status === 'completed' ? '#10b981' : '#e5e7eb'
                                }}
                            />
                        )}

                        {/* Icon */}
                        <div className="flex-shrink-0 relative z-10">
                            {getStatusIcon(stage.status)}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 border-l-4 pl-4 pb-4 ${getStatusColor(stage.status)}`}>
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                                {stage.timestamp && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        {formatTimestamp(stage.timestamp)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">{stage.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Refunds typically take 3-5 working days to reflect in your account.
                    You'll receive notifications at each stage via email and SMS.
                </p>
            </div>
        </div>
    );
};

export default RefundTimeline;
