import { GITHUB_ACCESSTOKEN_KEY, GITHUB_USER_INFO_KEY } from "./githubEnv.js";

export async function getGithubAccessToken() {
  return get(GITHUB_ACCESSTOKEN_KEY);
}
export async function getGitHubUserInfo() {
  return get(GITHUB_USER_INFO_KEY);
}

export async function saveGithubAccessToken(accessToken) {
  chrome.storage.local.set({ accessToken }, () => {
    if (chrome.runtime.lastError) {
      console.error("저장하는데 문제 발생:", chrome.runtime.lastError);
    } else {
      console.log("성공적으로 저장되었습니다.");
    }
  });
}
export async function saveGithubUserInfo(githubUserInfo) {
  chrome.storage.local.set({ githubUserInfo }, () => {
    if (chrome.runtime.lastError) {
      console.error("저장하는데 문제 발생:", chrome.runtime.lastError);
    } else {
      console.log("성공적으로 저장되었습니다.");
    }
  });
}

async function get(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError));
      }
      resolve(result);
    });
  });
}
