import type { NextApiRequest, NextApiResponse } from "next";
import githubClient from "~/services/github/GithubClient";
import { GithubUser } from "~/types/Users";

type ApiError = {
  status?: number;
  statusText: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const users = await githubClient.users.getUsers();
    res.status(200).json(users);
  } catch (error) {
    const apiError = error as ApiError;
    
    if (apiError?.status) {
      res.status(apiError.status).json({ message: apiError.statusText });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
