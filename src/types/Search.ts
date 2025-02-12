import { GithubUser } from "./Users";

export type SearchItem = GithubUser & {
    score: number;
}
export type GithubSearchResponse = {
    total_count: number;
    incomplete_results: boolean;
    items: SearchItem[];
}