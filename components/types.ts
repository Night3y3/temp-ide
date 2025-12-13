export type Step = 'input' | 'analyzing' | 'clarification' | 'provisioning' | 'completed';

export interface Question {
    id: string;
    question: string;
    options: string[];
}

export interface PlanResponse {
    analysis: string;
    questions: Question[];
}

export interface ProvisionResult {
    success: boolean;
    url?: string;
    instanceId?: string;
    error?: string;
}