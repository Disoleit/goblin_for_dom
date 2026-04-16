import Widget from '../app';

// Мокаем изображение
jest.mock('../../images/goblin.png', () => 'mocked-image-path');

describe('Widget', () => {
  let widget;

  // Настройка перед каждым тестом
  beforeEach(() => {
    // Очищаем document.body перед каждым тестом
    document.body.innerHTML = '';
    // Создаем новый экземпляр Widget
    widget = new Widget('test-widget');
  });

  // Очистка после каждого теста
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Constructor', () => {
    test('should create container div with correct class name', () => {
      const container = document.querySelector('.test-widget');
      expect(container).toBeTruthy();
      expect(container.className).toBe('test-widget');
    });

    test('should create 16 field divs', () => {
      const fields = document.querySelectorAll('.field');
      expect(fields.length).toBe(16);
    });

    test('should set correct styles for container', () => {
      const container = document.querySelector('.test-widget');
      expect(container.style.display).toBe('flex');
      expect(container.style.flexWrap).toBe('wrap');
      expect(container.style.width).toBe('480px');
    });

    test('should set correct styles for each field', () => {
      const fields = document.querySelectorAll('.field');
      fields.forEach((field) => {
        expect(field.style.width).toBe('120px');
        expect(field.style.height).toBe('120px');
        expect(field.style.backgroundColor).toBe('gray');
      });
    });

    test('should initialize position to a valid number', () => {
      expect(widget.position).toBeGreaterThanOrEqual(0);
      expect(widget.position).toBeLessThan(16);
    });

    test('should call createGoblinClass and nextPosition', () => {
      const createGoblinClassSpy = jest.spyOn(Widget, 'createGoblinClass');
      const nextPositionSpy = jest.spyOn(Widget.prototype, 'nextPosition');

      const newWidget = new Widget('test-widget-2');
      expect(newWidget).toBeInstanceOf(Widget);

      expect(createGoblinClassSpy).toHaveBeenCalled();
      expect(nextPositionSpy).toHaveBeenCalled();

      createGoblinClassSpy.mockRestore();
      nextPositionSpy.mockRestore();
    });
  });

  describe('createGoblinClass (static)', () => {
    test('should create style element with correct id', () => {
      const styleElement = document.querySelector('#goblin-styles');
      expect(styleElement).toBeTruthy();
      expect(styleElement.tagName).toBe('STYLE');
    });

    test('should not create duplicate style elements', () => {
      const styleElementsBefore = document.querySelectorAll('#goblin-styles').length;

      Widget.createGoblinClass();

      const styleElementsAfter = document.querySelectorAll('#goblin-styles').length;
      expect(styleElementsAfter).toBe(styleElementsBefore);
    });

    test('should add correct CSS rules', () => {
      const styleElement = document.querySelector('#goblin-styles');
      const cssText = styleElement.textContent;

      expect(cssText).toContain('.goblin-image');
      expect(cssText).toContain('background-image');
      expect(cssText).toContain('mocked-image-path');
      expect(cssText).toContain('background-size: cover');
      expect(cssText).toContain('background-position: center');
      expect(cssText).toContain('background-repeat: no-repeat');
    });
  });

  describe('nextPosition', () => {
    test('should add goblin-image class to a random field', () => {
      const fields = document.querySelectorAll('.field');
      const initialGoblinCount = Array.from(fields).filter((field) => field.classList.contains('goblin-image')).length;

      expect(initialGoblinCount).toBe(1);

      const goblinField = Array.from(fields).find((field) => field.classList.contains('goblin-image'));
      expect(goblinField).toBeTruthy();
    });

    test('should remove goblin-image from previous position', () => {
      const firstPosition = widget.position;

      widget.nextPosition();

      const fields = document.querySelectorAll('.field');
      const hasOldGoblin = fields[firstPosition] && fields[firstPosition].classList.contains('goblin-image');
      expect(hasOldGoblin).toBe(false);
    });

    test('should update position property', () => {
      const oldPosition = widget.position;
      widget.nextPosition();
      const newPosition = widget.position;

      expect(newPosition).not.toBe(oldPosition);
      expect(newPosition).toBeGreaterThanOrEqual(0);
      expect(newPosition).toBeLessThan(16);
    });

    test('should always generate a different position', () => {
      const oldPosition = widget.position;

      const originalRandom = Math.random;

      let callCount = 0;
      Math.random = jest.fn(() => {
        callCount += 1;
        if (callCount === 1) {
          return oldPosition / 16;
        }
        return (oldPosition + 1) / 16;
      });

      widget.nextPosition();

      expect(widget.position).not.toBe(oldPosition);

      Math.random = originalRandom;
    });

    test('should have exactly one goblin-image class at any time', () => {
      for (let i = 0; i < 20; i += 1) {
        widget.nextPosition();
        const fields = document.querySelectorAll('.field');
        const goblinCount = Array.from(fields).filter((field) => field.classList.contains('goblin-image')).length;
        expect(goblinCount).toBe(1);
      }
    });
  });

  describe('nextPositionTemporary', () => {
    test('should call nextPosition repeatedly', () => {
      jest.useFakeTimers();
      const nextPositionSpy = jest.spyOn(widget, 'nextPosition');

      widget.nextPositionTemporary();

      expect(nextPositionSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(3000);
      expect(nextPositionSpy).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(3000);
      expect(nextPositionSpy).toHaveBeenCalledTimes(2);

      nextPositionSpy.mockRestore();
      jest.useRealTimers();
    });

    test('should use setInterval with 3000ms delay', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval');

      widget.nextPositionTemporary();

      expect(setIntervalSpy).toHaveBeenCalled();
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 3000);

      setIntervalSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    test('should handle multiple widgets independently', () => {
      const firstWidget = new Widget('widget1');
      const secondWidget = new Widget('widget2');

      expect(firstWidget).toBeInstanceOf(Widget);
      expect(secondWidget).toBeInstanceOf(Widget);

      const container1 = document.querySelector('.widget1');
      const container2 = document.querySelector('.widget2');

      expect(container1).toBeTruthy();
      expect(container2).toBeTruthy();
      expect(container1).not.toBe(container2);

      const fields1 = container1.querySelectorAll('.field');
      const fields2 = container2.querySelectorAll('.field');

      expect(fields1.length).toBe(16);
      expect(fields2.length).toBe(16);
    });

    test('should work with different content names', () => {
      const customWidget = new Widget('custom-name');
      expect(customWidget).toBeInstanceOf(Widget);

      const container = document.querySelector('.custom-name');

      expect(container).toBeTruthy();
      expect(container.className).toBe('custom-name');
    });

    test('should handle rapid nextPosition calls without errors', () => {
      const firstPosition = widget.position;
      widget.nextPosition();
      expect(widget.position).not.toBe(firstPosition);

      // Просто вызываем nextPosition много раз подряд
      for (let i = 0; i < 9; i += 1) {
        widget.nextPosition();
      }

      // Проверяем, что только один гоблин
      const fields = document.querySelectorAll('.field');
      const goblinCount = Array.from(fields).filter((field) => field.classList.contains('goblin-image')).length;
      expect(goblinCount).toBe(1);
    });

    test('should handle many consecutive calls', () => {
      for (let i = 0; i < 50; i += 1) {
        widget.nextPosition();
      }

      const fields = document.querySelectorAll('.field');
      const goblinCount = Array.from(fields).filter((field) => field.classList.contains('goblin-image')).length;
      expect(goblinCount).toBe(1);
    });
  });
});
