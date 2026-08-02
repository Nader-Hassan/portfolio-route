function toggleTheme(){
  const html = document.getElementsByTagName("html");
  html[0].classList.onCh("light")
}
   const toggleBtn =  document.getElementById("theme-toggle-button");
   toggleBtn.addEventListener("click",toggleTheme)