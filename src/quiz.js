export default class Quiz {
  constructor(selector, quizTemplate) {
    let defaultOptions = {
      isNext: () => { },
      isPrev: () => { },
      isSending: () => { },

      progressBar: true
    };

    this.options = Object.assign(defaultOptions, quizTemplate);
    this.count = 0;
    this.quizTemplate = quizTemplate;
    this.quiz = document?.querySelector(selector);
    this.progressBar = this.quiz?.querySelector('[data-quiz-progress]');
    this.resultArray = [];
    this.tmp = {};

    this.events();
  }

  events() {
    document.addEventListener('DOMContentLoaded', () => {
      this.quizInit();

      this.quiz.addEventListener('click', (e) => {
        if (e.target == this.quiz.querySelector('[data-quiz-next]')) {
          this.nextQuestion();
        }

        if (e.target == this.quiz.querySelector('[data-quiz-prev]')) {
          this.prevQuestion();
        }

        if (e.target == this.quiz.querySelector('[data-quiz-send]')) {
          e.preventDefault();
          this.quizSend();
        }
      })

      this.quiz.addEventListener('input', (e) => {
        if (e.target == e.target.closest('input')) {
          this.quiz.querySelectorAll('input').forEach(input => this.removeErrorClass(input));
        }
      })

      this.quiz.addEventListener('change', (e) => {
        if (e.target == e.target.closest('input')) {
          this.quiz.querySelectorAll('input').forEach(input => this.removeErrorClass(input));
          this.tmp = this.serialize(this.quiz);
        }

        if (e.target.tagName == 'INPUT') {
          let inputs = this.quiz.querySelectorAll('input');
          let reqInputs = this.quiz?.querySelectorAll('input.req');

          if (e.target.type !== 'checkbox' && e.target.type !== 'radio' && !reqInputs.length > 0) {
            inputs.forEach(input => input.checked = false);
          }

          this.tmp = this.serialize(this.quiz);
        }
      })
    })
  }

  quizInit() {
    this.quiz.insertAdjacentHTML('beforeend', this.quizTemplate[this.count]);

    if (this.options.progressBar) {
      this.updateScrollbar();
    } else {
      this.progressBar?.classList.add('hide');
    }
  }

  addErrorClass(input) {
    input.classList.add('error');
  }

  removeErrorClass(input) {
    input.classList.remove('error');
  }

  quizValidation() {
    let isValid = false;
    const inputs = this.quiz?.querySelectorAll('input');
    const reqInputs = this.quiz?.querySelectorAll('input.req');

    inputs.forEach(input => {
      if (input.classList.contains('req')) {
        switch (input.type) {
          case 'tel':
          case 'text':
            if (!input.value) {
              isValid = false;
              this.addErrorClass(input);
              return;
            }
            break;
          case 'checkbox':
          case 'radio':
            if (!input.checked) {
              isValid = false;
              this.addErrorClass(input);
              return;
            }
            break;
        }
        isValid = true;
      } else {
        if (reqInputs.length === 0) {
          switch (input.type) {
            case 'tel':
              (input.value) ? isValid = true : this.addErrorClass(input);
            case 'text':
              (input.value) ? isValid = true : this.addErrorClass(input);
            case 'checkbox':
              (input.checked) ? isValid = true : this.addErrorClass(input);
            case 'radio':
              (input.checked) ? isValid = true : this.addErrorClass(input);
          } 
        }
      }
    });

    return isValid;
  }

  nextQuestion() {
    if (this.quizValidation()) {
      this.pushToSend();

      this.count++

      if (this.options.progressBar) {
        this.updateScrollbar();
      }

      this.quiz.querySelector('.quiz__content').remove();

      this.quiz.insertAdjacentHTML('beforeend', this.quizTemplate[this.count]);

      this.options.isNext(this);
    }
  }

  prevQuestion() {
    this.removeResultArray();

    this.count--;

    if (this.options.progressBar) {
      this.updateScrollbar();
    }

    this.quiz.querySelector('.quiz__content').remove();

    this.quiz.insertAdjacentHTML('beforeend', this.quizTemplate[this.count]);

    this.options.isPrev(this);
  }

  pushToSend() {
    this.resultArray.push(this.tmp);
  }

  removeResultArray() {
    this.resultArray.pop();
  }

  quizSend() {
    if (this.quizValidation()) {
      this.pushToSend();

      let inputs = this.quiz.querySelectorAll('input');
      inputs.forEach(input => {
        input.classList.remove('error');
        input.checked = false;
        input.value = '';
      });

      this.options.isSending(this);
    }
  }

  updateScrollbar() {
    this.progressBar.style.setProperty('--quiz-progress', `${(this.count + 1) / this.quizTemplate.length * 100}%`);
  }

  serialize(form) {
    let field, s = {};
    let valueString = '';
    if (typeof form == 'object' && form.nodeName == "FORM") {
      let len = form.elements.length;
      for (let i = 0; i < len; i++) {
        field = form.elements[i];

        if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
          if (field.type == 'select-multiple') {
            for (j = form.elements[i].options.length - 1; j >= 0; j--) {
              if (field.options[j].selected)
                s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
            }
          } else if ((field.type != 'checkbox' && field.type != 'radio' && field.value) || field.checked) {
            valueString += field.value + ',';

            s[field.name] = valueString;
          }
        }
      }
    }
    return s
  }
}