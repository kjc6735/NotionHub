const authBtn = document.getElementById("githubOAuthButton");

authBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "auth" }, (res) => {});
});
