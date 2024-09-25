const NOTION_DOMAIN = "notion.so"


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type !== 'FETCH_INTERCEPTED') {
        return;
    }

    try {
        // 도메인에 대한 쿠키 가져오기
        const notionCookies = await getCookies(NOTION_DOMAIN);
        const cookie = notionCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
        
        // exportURL 가져오기
        const { exportURL } = message.data.results[0].status;
        
        // exportURL로 fetch 요청
        const response = await fetch(exportURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/zip',
                'Cookie': cookie  // 쿠키 설정
            }
        });

        // 응답 체크
        if (!response.ok) {
            throw new Error("요청이 정상적으로 완료되지 않았습니다.");
            return;
        }
        
        const blob = await response.blob();
                
        //todo: 파일집 파일 푼 다음 깃허브에 업로드 
    } catch (error) {
        console.log(error)
    }
});



const getCookies = async (domain) => {
    return chrome.cookies.getAll({ domain });
}
