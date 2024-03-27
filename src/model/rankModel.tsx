export interface RankModel {
    id: number;
    user_id: number;
    image_url: string;
    votes: number;
    rank: number;
    created_at: string;
    updated_at: string;
    username: string;
    yesterday: string;
    rank_yesterday: number;
    vote_yesterday: number;
}