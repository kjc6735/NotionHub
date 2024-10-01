import { GITHUB_GET_USER_REPO_URL, GITHUB_GET_USER_URL } from "./githubEnv.js";
import { getGithubAccessToken } from "./githubStorage.js";

const getTokenOrError = async () => {
  const { accessToken } = await getGithubAccessToken();
  if (!accessToken) {
    throw new Error("Access token is not available.");
  }
  return accessToken;
};

export async function getGithubRepositories() {
  try {
    const accessToken = await getTokenOrError();

    const response = await fetch(GITHUB_GET_USER_REPO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const repositories = await response.json();
    console.log(repositories);
    return repositories;
  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error.message);
    throw error;
  }
}

export async function getUserInfo() {
  try {
    const accessToken = await getTokenOrError();

    const response = await fetch(GITHUB_GET_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const repositories = await response.json();
    console.log(repositories);
    return repositories;
  } catch (error) {
    console.error("Failed to fetch GitHub User :", error.message);
    throw error;
  }
}
