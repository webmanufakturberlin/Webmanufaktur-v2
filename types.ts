import React from 'react';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    delay?: number;
}