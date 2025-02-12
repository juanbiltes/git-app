import type { NextApiRequest, NextApiResponse } from "next";
import GithubClient from "~/services/github/GithubClient";
import { GithubSearchResponse } from "~/types/Search";

type ApiError = {
  status?: number;
  statusText: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const searchResults = await GithubClient.search.searchUsers(req.query?.q as string || '');
    res.status(200).json(searchResults);
  } catch (error) {
    const apiError = error as ApiError;
    
    if (apiError?.status) {
      res.status(apiError.status).json({ message: apiError.statusText });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
