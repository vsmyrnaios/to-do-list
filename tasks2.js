const text = document.querySelector(".sec-text");
const textloadText = () => {
  setTimeout(() => {
    text.textContent = "Freelancer";
  }, 0);
  setTimeout(() => {
    text.textContent = "Blogger";
  }, 4000);
  setTimeout(() => {
    text.textContent = "Youtuber";
  }, 8000);
};

textLoad();
setInterval(textLoad, 12000);
