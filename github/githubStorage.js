export async function getGithubAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["githubAccessToken"], (result) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError));
      }
      resolve(result.accessToken);
    });
  });
}

export async function saveGithubAccessToken(accessToken) {
  chrome.storage.local.set({ githubAccessToken: accessToken }, () => {
    if (chrome.runtime.lastError) {
      console.error("저장하는데 문제 발생:", chrome.runtime.lastError);
    } else {
      console.log("성공적으로 저장되었습니다.");
    }
  });
}
