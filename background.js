import {
  GITHUB_ACCESSTOKEN_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
  GITHUB_SCOPE,
} from "./github/githubEnv.js";
import { saveGithubAccessToken } from "./github/githubStorage.js";

const NOTION_DOMAIN = "notion.so";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type !== "FETCH_INTERCEPTED") {
    return;
  }

  try {
    // 도메인에 대한 쿠키 가져오기
    const notionCookies = await getCookies(NOTION_DOMAIN);
    const cookie = notionCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // exportURL 가져오기
    const { exportURL } = message.data.results[0].status;

    // exportURL로 fetch 요청
    const response = await fetch(exportURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/zip",
        Cookie: cookie, // 쿠키 설정
      },
    });

    // 응답 체크
    if (!response.ok) {
      throw new Error("요청이 정상적으로 완료되지 않았습니다.");
    }

    const blob = await response.blob();

    //todo: 파일집 파일 푼 다음 깃허브에 업로드
  } catch (error) {
    console.log(error);
  }
});

const getCookies = async (domain) => {
  return chrome.cookies.getAll({ domain });
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "auth") {
    let code = null;

    sendResponse({ success: true, status: "pending", message: "인증 중..." });

    chrome.identity.launchWebAuthFlow(
      {
        url: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=${GITHUB_SCOPE}`,
        interactive: true,
      },
      async (redirectUri) => {
        if (chrome.runtime.lastError || !redirectUri) {
          console.error("WebAuthFlow 에러 : ", chrome.runtime.lastError);
          return;
        }
        const urlParams = new URLSearchParams(new URL(redirectUri).search);
        code = urlParams.get("code");
        if (!code) {
          console.error("No code received from GitHub");
          return;
        }
        try {
          const access_token = await getAccessToken({ code });
          if (!access_token) {
            console.error("Failed to retrieve access token");
            return;
          }
          await saveGithubAccessToken(access_token);

          console.log("Authentication successful!");
        } catch (error) {
          console.error("Error during token exchange:", error);
        }
      }
    );

    return true;
  }
});

async function getAccessToken({ code }) {
  const response = await fetch(GITHUB_ACCESSTOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_REDIRECT_URI,
    }),
  });
  const data = await response.json();
  /*
    {
        access_token: "",
        scope: "repo,user",
        token_type: "bearer"
    }
  */
  return data.access_token ?? null;
}
