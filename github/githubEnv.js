export const GITHUB_CLIENT_ID = "Ov23liJjIfn18PSsJh7i";
export const GITHUB_CLIENT_SECRET = "ea4bc508c97b8806e77e392c816a0769aad2e875";
export const GITHUB_REDIRECT_URI = chrome.identity.getRedirectURL();
export const GITHUB_SCOPE = "repo,user";

//api url
export const GITHUB_GET_USER_REPO_URL = "https://api.github.com/user/repos";
export const GITHUB_ACCESSTOKEN_URL =
  "https://github.com/login/oauth/access_token";

export const GITHUB_GET_USER_URL = "https://api.github.com/user";

// key
export const GITHUB_ACCESSTOKEN_KEY = "accessToken";
export const GITHUB_USER_INFO_KEY = "githubUserInfo";
