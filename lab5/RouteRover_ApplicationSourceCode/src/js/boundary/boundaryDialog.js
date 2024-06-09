import Boundary from './boundary';
import icon from 'url:../../img/sprite.svg';

/**
 * For handling user inputs and interactions in the review dialog
 * 
 * @extends Boundary
 */
class BoundaryDialog extends Boundary {
  /**
   * The parent element containing the dialog.
   * @type {HTMLElement}
   */
  _parentEl = document.querySelector('.dialog');

  /**
   * The container element for displaying stars.
   * @type {HTMLElement}
   */
  _starsContainer = document.querySelector('.stars');

  /**
   * The textarea element for entering comments.
   * @type {HTMLTextAreaElement}
   */
  _textareaEl = document.getElementById('input-comment');

  /**
   * The time element for entering run time.
   */
  _runTimeEl = document.getElementById('run-time');

  /**
   * The submit button for submitting reviews.
   * @type {HTMLButtonElement}
   */
  _submitBtn = document.getElementById('submit-review-btn');

  /**
   * The close button for closing the review dialog.
   */
  _closeBtn = document.getElementById('close-button');

  /**
   * The button for starting a run.
   * @type {HTMLButtonElement}
   */
  _startRunningBtn = document.getElementById('start-running-btn');

  /**
   * The number of stars selected.
   * @type {number}
   */
  _numStars = 0;

  /**
   * The comment entered by the user.
   * @type {string}
   */
  _comment;

  /**
   * Initializes the dialog with the current number of stars.
   */
  init() {
    this.updateStars(this._numStars);
  }

  /**
   * Adds an event handler for adding a new review.
   * @param {Function} handler - The handler function for adding a new review.
   */
  addHandlerAddNewReview(handler) {
    this._submitBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        const comment = this._textareaEl.value;
        const duration = this._runTimeEl.value;
        const img = document.querySelector('#upload-image').files[0];
        handler(this._numStars, comment, duration, img);
      }.bind(this)
    );
  }

  /**
   * Shows the review dialog.
   */
  startRunning() {
    this._parentEl.classList.remove('hidden');
  }

  /**
   * Hides the review dialog by adding the 'hidden' class to the parent element.
   */
  hideDialog() {
    this._parentEl.classList.add('hidden');
  }

  /**
   * Adds a handler for the close dialog button to close the dialog when clicked.
   */
  addHandlerCloseDialog() {
    this._closeBtn.addEventListener(
      'click',
      function (e) {
        this.hideDialog();
      }.bind(this)
    );
  }

  /**
   * Updates the upload image label after image is uploaded
   */
  addHandlerUploadImage() {
    document.addEventListener('DOMContentLoaded', function () {
      const uploadInput = document.getElementById('upload-image');
      const uploadLabel = document.getElementById('upload-label');

      uploadInput.addEventListener('change', function () {
        if (uploadInput.files && uploadInput.files.length > 0) {
          uploadLabel.textContent = 'Image uploaded!';
        } else {
          uploadLabel.textContent = 'Upload an image';
        }
      });
    });
  }

  /**
   * Adds an event handler for updating the selected stars.
   * @param {Function} handler - The handler function for updating the selected stars.
   */
  addHandlerUpdateStars(handler) {
    this._starsContainer.addEventListener('click', function (e) {
      const star = e.target.closest('.star');
      if (!star) return;
      const numStars = star.dataset.star;

      handler(+numStars);
    });
  }

  /**
   * Updates the display of stars based on the number of stars selected.
   * @param {number} numStars - The number of stars selected.
   */
  updateStars(numStars) {
    this._starsContainer.innerHTML = '';
    this._numStars = numStars;
    this._starsContainer.insertAdjacentHTML(
      'beforeend',
      this._generateMarkups()
    );
  }

  /**
   * Generates the HTML markup for displaying stars.
   * @returns {string} The HTML markup for displaying stars.
   */
  _generateMarkups() {
    let markups = '';
    for (let i = 1; i <= 5; i++) {
      const starState = i <= this._numStars ? 'full' : 'empty';
      markups += this._generateMarkup(starState, i);
    }
    return markups;
  }

  /**
   * Generates the HTML markup for a single star.
   * @param {string} starState - The state of the star ('full' or 'empty').
   * @param {number} data - The data attribute value for the star.
   * @returns {string} The HTML markup for a single star.
   */
  _generateMarkup(starState, data) {
    return `<svg class="star" data-star=${data}>
            <use xlink:href="${icon}#icon-star-${starState}"></use>
          </svg>`;
  }
}

export default new BoundaryDialog();
