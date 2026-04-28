import goblinImage from '../images/goblin.png';

export default class Widget {
  constructor(contentName) {
    this.contentName = contentName;
    this.position = -1;
    this.field_size = 16;
    this.move_interval = 3000;

    const content = document.createElement('div');
    content.className = this.contentName;
    content.style.display = 'flex';
    content.style.flexWrap = 'wrap';
    content.style.width = '486px';
    document.body.append(content);

    for (let i = 0; i < this.field_size; i += 1) {
      const field = document.createElement('div');
      field.className = 'field';
      field.style.width = '120px';
      field.style.height = '120px';
      field.style.backgroundColor = 'gray';
      field.style.border = 'solid 1px white'
      content.append(field);
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
      document.head.append(styleSheet);
    }
  }

  nextPosition() {
    let randInt;

    do {
      randInt = Math.floor(Math.random() * this.field_size);
    } while (randInt === this.position);

    const container = document.querySelector(`.${this.contentName}`);
if (!container) return;
const contentField = container.querySelectorAll('.field');

    contentField.forEach((field) => {
      field.classList.remove('goblin-image');
    });
    contentField[randInt].classList.add('goblin-image');
    this.position = randInt;
  }

  nextPositionTemporary() {
    this.intervalId = setInterval(() => {
      this.nextPosition();
    }, this.move_interval);
  }

  stop() {
    if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }
  }
}

const run = new Widget('run');
run.nextPositionTemporary();
