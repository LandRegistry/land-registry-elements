document.querySelector('.split-detail-trigger').addEventListener('click', function(e) {
  e.preventDefault();

  this.classList.toggle('split-detail-trigger-active');
  document.querySelector(this.getAttribute('href')).classList.toggle('split-detail-contents-active');
});
