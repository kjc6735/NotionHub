const authBtn = document.getElementById("githubOAuthButton");

authBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "auth" }, (res) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (res.status) {
    } else {
      console.log("Authentication successful");
    }
  });
});
