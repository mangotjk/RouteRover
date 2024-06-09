import icon from 'url:../img/sprite.svg';

export function addHandlerInputAutoComplete(input) {
  return new google.maps.places.Autocomplete(input, {
    fields: ['address_components', 'geometry', 'icon', 'name'],
    strictBounds: false,
    componentRestrictions: { country: 'SG' },
  });
}

export function generateStars(numStars, className = 'star') {
  let starStates = [];
  let remainingStars = numStars;
  for (let i = 1; i <= 5; i++) {
    if (remainingStars >= 1) {
      starStates.push('full');
      remainingStars--;
    } else if (remainingStars > 0) {
      starStates.push('half');
      remainingStars = 0;
    } else {
      starStates.push('empty');
    }
  }
  return starStates
    .map(starState => generateStarMarkup(starState, className))
    .join('');
}

function generateStarMarkup(starState, className) {
  return `<svg class="${className}">
            <use xlink:href="${icon}#icon-star-${starState}"></use>
          </svg>`;
}
