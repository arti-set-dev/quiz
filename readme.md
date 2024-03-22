# Quiz
---

## Описание

Небольшой плагин квиза с возможностью гибко менять шаблон разметки и настраивать обязательные поля.

Демо: https://codepen.io/arti-set-dev/pen/qBwmbJg

**Преимущества данной библиотеки**:

-отсутствие зависимостей

-легковесная

-гибкая валидация

-возможность создать свой шаблон разметки

## Начало работы

Для начала работы загрузите плагин в свой проект: 

`npm i r-dev-quiz`

Напишите базовую разметку:

```html
<form method="post" class="quiz">
    <div class="quiz__progress" data-quiz-progress></div>
</form>
```

Создайте массив с вопросами:

Пример:

``` js
const quizData = [{
  number: 1,
  title: "На какую сумму вы рассчитываете?",
  answer_alias: "money",
  answers: [{
    answer_title: "500 рублей",
    type: "checkbox"
  },
  {
    answer_title: "5000 рублей",
    type: "checkbox"
  },
  {
    answer_title: "Введу текстом",
    type: "text"
  }
  ]
},
{
  number: 2,
  title: "Какой именно вам нужен сайт?",
  answer_alias: "great",
  answers: [{
    answer_title: "Лендинг-пейдж",
    type: "radio"
  },
  {
    answer_title: "Корпоративный сайт",
    type: "radio"
  },
  {
    answer_title: "Интернет-магазин",
    type: "radio"
  }
  ]
},
{
  number: 3,
  title: "Уточните детали реализации",
  answer_alias: "details",
  answers: [{
    answer_title: "детали реализации",
    type: "text"
  },
  ]
},
{
  number: 4,
  title: "На какую сумму вы рассчитываете?",
  answer_alias: "money",
  answers: [{
    answer_title: "500 рублей",
    type: "checkbox"
  },
  {
    answer_title: "5000 рублей",
    type: "checkbox"
  },
  {
    answer_title: "Введу текстом",
    type: "text"
  }
  ]
},
{
  number: 5,
  title: "Вы успешно ответили на все вопросы",
  desc: 'Выберете удобный способ связи и мы свяжемся с вами в ближайшее время',
},
];
```

Создайте шаблон разметки под ваши потребности:

Пример:

```js
const quizTemplate = (quizData) => {
  const template = quizData?.map(question => {
    const { number, title, answer_alias } = question;
    const answers = question.answers?.map(answer => {
      const { answer_title, type } = answer;
      return `

      <label class="quiz__label">
        <span>${answer_title}</span>
        <input type="${type}" name="${answer_alias}" value="${type !== 'text' ? answer_title : ''}" class="quiz__input">
      </label>

		`;
    })
    return `
    <div class="quiz__content">
      <div class="quiz__numbers">${number} / ${quizData.length}</div>
      <div class="quiz__head">
        <span class="quiz__content-text">${title}</span>
        ${number === quizData.length ? '<span class="quiz__content-text">Выберете удобный способ связи и мы свяжемся с вами в ближайшее время</span>' : ''}
      </div>
      <div class="quiz__labels">
        ${number !== quizData.length ?
        `${answers?.join('')}` :
        ` <label class="quiz__label">
            <span>Telegram</span>
            <input type="radio" name="feedback" value="Telegram" class="quiz__input">
          </label>
          <label class="quiz__label">
            <span>Whatsapp</span>
            <input type="radio" name="feedback" value="Whatsapp" class="quiz__input">
          </label>
          <label class="quiz__label">
            <span>Phone</span>
            <input type="radio" name="feedback" value="Phone" class="quiz__input">
          </label>
          <input type="tel" name="feedback" class="quiz__input req" placeholder="+7 999 999 99 99">`}
      </div>
      <div class="quiz__nav">
        ${number !== 1 && number !== quizData.length ? '<button type="button" class="quiz__btn" data-quiz-prev>Предыдущий</button>' : ''}
        ${number !== quizData.length ?
        '<button type="button" class="quiz__btn" data-quiz-next>Следующий</button>' :
        '<button type="submit" class="quiz__btn" data-quiz-send>Отправить</button>'}
      </div>
    </div>
    `
  })

  return template;
}
```

Инициализируйте библиотеку:

```js
import Quiz from 'r-quiz';
const quiz = new Quiz('.quiz', quizTemplate(quizData));
```

## Отправка данных на сервер:

Для отправки данных после инициализации воспользуйтесь встроенной функцией `isSending`:

```js
quiz.options.isSending = (quizEl) => {
  const formData = new FormData();

  for (let item of quiz.resultArray) {
    for (let obj in item) {
      formData.append(obj, item[obj].substring(0, item[obj].length - 1))
    }
  }

  fetch('mail.php', {
    method: 'POST',
    body: formData
  });
}
```

Внутри этой функции вы можете писать любую логику.

## Настройки

### progressBar

По умолчанию `true`. Для изменения параметра после инициализации пропишите следующее:
```js
quiz.options.progressBar = false;
```
### Использование класса req

Вы можете задавать обязательные поля без заполнения которых квиз не перейдёт к следующему вопросу и не отправит данные.

Для этого в массиве объектов всех вопросов вы можете написать следующее:

```js
const quizData = [{
  number: 1,
  title: "На какую сумму вы рассчитываете?",
  answer_alias: "money",
  answers: [{
    answer_title: "500 рублей",
    classes: 'req',
    type: "checkbox"
  },
  {
    answer_title: "5000 рублей",
    type: "checkbox"
  },
  {
    answer_title: "Введу текстом",
    type: "text",
  }
  ]
},
];
```

Был добавлен ключ classes со значением req в первый чекбокс.

Далее выведите класс в шаблоне:

```js
const quizTemplate = (quizData) => {
  const template = quizData?.map(question => {
    const { number, title, answer_alias } = question;
    const answers = question.answers?.map(answer => {
      const { answer_title, type, classes } = answer;
      return `

      <label class="quiz__label">
        <span>${answer_title}</span>
        <input type="${type}" name="${answer_alias}" value="${type !== 'text' ? answer_title : ''}" class="quiz__input ${classes !== undefined ? classes : ''}"> // выводим classes  
      </label>

		`;
    })
    return `
    <div class="quiz__content">
      <div class="quiz__numbers">${number} / ${quizData.length}</div>
      <div class="quiz__head">
        <span class="quiz__content-text">${title}</span>
        ${number === quizData.length ? '<span class="quiz__content-text">Выберете удобный способ связи и мы свяжемся с вами в ближайшее время</span>' : ''}
      </div>
      <div class="quiz__labels">
        ${number !== quizData.length ?
        `${answers?.join('')}` :
        ` <label class="quiz__label">
            <span>Telegram</span>
            <input type="radio" name="feedback" value="Telegram" class="quiz__input">
          </label>
          <label class="quiz__label">
            <span>Whatsapp</span>
            <input type="radio" name="feedback" value="Whatsapp" class="quiz__input">
          </label>
          <label class="quiz__label">
            <span>Phone</span>
            <input type="radio" name="feedback" value="Phone" class="quiz__input">
          </label>
          <input type="tel" name="feedback" class="quiz__input req" placeholder="+7 999 999 99 99">`}
      </div>
      <div class="quiz__nav">
        ${number !== 1 && number !== quizData.length ? '<button type="button" class="quiz__btn" data-quiz-prev>Предыдущий</button>' : ''}
        ${number !== quizData.length ?
        '<button type="button" class="quiz__btn" data-quiz-next>Следующий</button>' :
        '<button type="submit" class="quiz__btn" data-quiz-send>Отправить</button>'}
      </div>
    </div>
    `
  })

  return template;
}
```

Готово. Теперь квиз не перейдёт к следующему вопросу пока не будет отмечен обязательный чекбокс. Эту логику можно примерять ко всем инпутам в вашем квие.