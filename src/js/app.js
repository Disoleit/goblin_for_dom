import goblinImage from '../images/goblin.png';

export default class Widget {
  constructor(contentName) {
    this.contentName = contentName;
    this.position = -1;

    const content = document.createElement('div');
    content.className = this.contentName;
    content.style.display = 'flex';
    content.style.flexWrap = 'wrap';
    content.style.width = '480px';
    document.body.appendChild(content);

    for (let i = 0; i < 16; i += 1) {
      const field = document.createElement('div');
      field.className = 'field';
      field.style.width = '120px';
      field.style.height = '120px';
      field.style.backgroundColor = 'gray';
      content.appendChild(field);
    }
    Widget.createGoblinClass();
    this.nextPosition();
  }

  static createGoblinClass() {
    if (!document.querySelector('#goblin-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'goblin-styles';
      styleSheet.textContent = `
                .goblin-image {
                    background-image: url('${goblinImage}');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }
            `;
      document.head.appendChild(styleSheet);
    }
  }

  nextPosition() {
    let randInt;

    do {
      randInt = Math.floor(Math.random() * 16);
    } while (randInt === this.position);

    const contentField = document.querySelector(`.${this.contentName}`).querySelectorAll('.field');

    contentField.forEach((field) => {
      field.classList.remove('goblin-image');
    });
    contentField[randInt].classList.add('goblin-image');
    this.position = randInt;
  }

  nextPositionTemporary() {
    setInterval(() => {
      this.nextPosition();
    }, 3000);
  }
}

const run = new Widget('run');
run.nextPositionTemporary();
