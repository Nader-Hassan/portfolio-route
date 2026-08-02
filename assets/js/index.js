const toggleButton = document.getElementById('theme-toggle-button');
const htmlElement = document.documentElement;

function ToggleTheme(){
    const isDark = htmlElement.classList.toggle('dark');
    toggleButton.setAttribute('aria-pressed' , isDark);
    localStorage.setItem('Theme' , isDark ? 'dark' : 'light');
}

function initializeTheme(){
    const savedTheme = localStorage.getItem('Theme');
    if (savedTheme === 'light'){
        htmlElement.classList.remove('dark');
        toggleButton.setAttribute('aria-pressed' , 'false');
    } else {
        htmlElement.classList.add('dark');
        toggleButton.setAttribute('aria-pressed' , 'true');
    }
}

if(toggleButton){
    toggleButton.addEventListener('click' , ToggleTheme);
} else {
    console.error('Theme toggle button not found in the DOM.');
}

initializeTheme();