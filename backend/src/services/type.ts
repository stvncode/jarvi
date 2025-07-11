export type MessageType = 'EMAIL_SENT' | 'LINKEDIN_MESSAGE_SENT' | 'LINKEDIN_INMAIL_SENT';

export interface StatsFilters {
    user_id: string;
    start_date: string;
    end_date: string;
    project_id?: string;
  }
  
  export interface MessageTypeStats {
    type: MessageType;
    total_sent: number;
    total_replied: number;
    response_rate: number;
    comparison?: {
      previous_response_rate: number;
      change_percentage: number;
      is_improvement: boolean;
    };
  }
  
  export interface PeriodComparison {
    current_response_rate: number;
    previous_response_rate: number;
    change_percentage: number;
    is_improvement: boolean;
  }
  
  export interface StatsResponse {
    period: {
      start_date: string;
      end_date: string;
    };
    stats_by_type: MessageTypeStats[];
    comparison?: PeriodComparison;
    total_messages: number;
    overall_response_rate: number;
  }
  
  export interface StatsRequest {
    filters: StatsFilters;
    include_comparison?: boolean;
  } 