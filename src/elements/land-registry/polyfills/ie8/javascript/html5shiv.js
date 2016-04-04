/**
 * This html5 shiv is the bare minimum that is required to force IE to render html5 elements
 */
var elements = 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary template time video'.split(' ');
for(var i in elements) {
  if (elements.hasOwnProperty(i)) {
    document.createElement(elements[i]);
  }
}
