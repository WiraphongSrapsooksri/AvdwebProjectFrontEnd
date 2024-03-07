export interface ListImageByID {
    userid: number;
    username: string;
    imgid: number;
    image_url: string;
    rank: number | null;
    votes: number;
    created_at: string;
    updated_at: string;
}

