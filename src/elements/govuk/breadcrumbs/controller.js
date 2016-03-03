var crumbs = document.querySelector('.breadcrumbs ol');
crumbs.scrollLeft = crumbs.clientWidth;

crumbs.addEventListener('scroll', function(e) {
  console.log(crumbs.scrollLeft, crumbs.scrollWidth - crumbs.offsetWidth);

  calc();
});

function calc() {
  if(crumbs.scrollLeft === crumbs.scrollWidth - crumbs.offsetWidth) {
    crumbs.classList.add('breadcrumbs-at-right');
    crumbs.classList.remove('breadcrumbs-at-left');
  } else if(crumbs.scrollLeft === 0) {
    crumbs.classList.add('breadcrumbs-at-left');
    crumbs.classList.remove('breadcrumbs-at-right');
  } else {
    crumbs.classList.remove('breadcrumbs-at-left');
    crumbs.classList.remove('breadcrumbs-at-right');
  }
}

calc();
