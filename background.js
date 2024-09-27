const NOTION_DOMAIN = "notion.so";
const CLIENT_ID = "Ov23liJjIfn18PSsJh7i";
const CLIENT_SECRET = "ea4bc508c97b8806e77e392c816a0769aad2e875";
const REDIRECT_URI = chrome.identity.getRedirectURL();
const GITHUB_ACCESSTOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_SCOPE = "repo,user";

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
    await chrome.identity.launchWebAuthFlow(
      {
        url: `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${GITHUB_SCOPE}`,
        interactive: true,
      },
      async (redirectUri) => {
        // 결과 콜백
        if (chrome.runtime.lastError || !redirectUri) {
          sendResponse({ success: false, error: chrome.runtime.lastError });
          return;
        }
        const urlParams = new URLSearchParams(new URL(redirectUri).search);
        code = urlParams.get("code");
        if (!code) {
          sendResponse({ success: false, error: "로그인 실패" });
          return;
        }
        const access_token = await getAccessToken({ code });
        if (!access_token) {
          sendResponse({ success: false, error: "로그인 실패" });
          return;
        }

        sendResponse({ success: true });
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
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const data = response.json();
  /*
    {
        access_token: "",
        scope: "repo,user",
        token_type: "bearer"
    }
  */

  return data.access_token ?? null;
}
