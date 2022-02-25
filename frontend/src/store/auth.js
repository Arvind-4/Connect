var rootDiv = document.querySelector("#root")
const is_auth = rootDiv.getAttribute("data-is_authenticated")

export const is_authenticated = String(is_auth.toLowerCase())