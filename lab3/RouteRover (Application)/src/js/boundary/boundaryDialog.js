import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';

class BoundaryDialog extends Boundary {
  _parentEl = document.querySelector('.dialog');
  _starsContainer = document.querySelector('.stars');
  _textareaEl = document.getElementById('input-comment');
  _submitBtn = document.getElementById('submit-review-btn');
  _startRunningBtn = document.getElementById('start-running-btn');
  _numStars = 0;
  _comment;

  init() {
    this.updateStars(this._numStars);
  }

  addHandlerAddNewReview(handler) {
    this._submitBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        this._parentEl.classList.toggle('hidden');
        const comment = this._textareaEl.value;
        handler(this._numStars, comment);
      }.bind(this)
    );
  }

  addHandlerStartRunning() {
    this._startRunningBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        this._parentEl.classList.toggle('hidden');
      }.bind(this)
    );
  }

  addHandlerUpdateStars(handler) {
    this._starsContainer.addEventListener('click', function (e) {
      const star = e.target.closest('.star');
      if (!star) return;
      const numStars = star.dataset.star;
      handler(+numStars);
    });
  }

  updateStars(numStars) {
    this._starsContainer.innerHTML = '';
    this._numStars = numStars;
    this._starsContainer.insertAdjacentHTML(
      'beforeend',
      this._generateMarkups()
    );
  }

  _generateMarkups(numStars) {
    let markups = '';
    for (let i = 1; i <= 5; i++) {
      const starState = i <= this._numStars ? 'full' : 'empty';
      markups += this._generateMarkup(starState, i);
    }
    return markups;
  }

  _generateMarkup(starState, data) {
    return `<svg class="star" data-star=${data}>
            <use xlink:href="${icon}#icon-star-${starState}"></use>
          </svg>`;
  }
}

export default new BoundaryDialog();
