class WindowManager {
  #windows;
  #count;
  #id;
  #winData;
  #winShapeChangeCallback;
  #winChangeCallback;

  constructor() {
    // event listener for when localStorage is changed from another window
    addEventListener('storage', (event) => {
      if (event.key === 'windows') {
        const newWindows = JSON.parse(event.newValue);
        const winChange = this.#didWindowsChange(this.#windows, newWindows);

        this.#windows = newWindows;

        if (winChange && this.#winChangeCallback) {
          this.#winChangeCallback();
        }
      }
    });

    // event listener for when the current window is about to be closed
    window.addEventListener('beforeunload', () => {
      const index = this.getWindowIndexFromId(this.#id);

      // remove this window from the list and update local storage
      this.#windows.splice(index, 1);
      this.updateWindowsLocalStorage();
    });
  }

  #didWindowsChange(pWins, nWins) {
    if (pWins.length !== nWins.length) {
      return true;
    } else {
      return pWins.some((win, i) => win.id !== nWins[i].id);
    }
  }

  init(metaData) {
    this.#windows = JSON.parse(localStorage.getItem('windows')) || [];
    this.#count = +localStorage.getItem('count') || 0;
    this.#count++;

    this.#id = this.#count;
    const shape = this.getWinShape();
    this.#winData = { id: this.#id, shape, metaData };
    this.#windows.push(this.#winData);

    localStorage.setItem('count', this.#count);
    this.updateWindowsLocalStorage();
  }

  getWinShape() {
    return {
      x: window.screenLeft,
      y: window.screenTop,
      w: window.innerWidth,
      h: window.innerHeight,
    };
  }

  getWindowIndexFromId(id) {
    return this.#windows.findIndex((win) => win.id === id);
  }

  updateWindowsLocalStorage() {
    localStorage.setItem('windows', JSON.stringify(this.#windows));
  }

  update() {
    const winShape = this.getWinShape();

    if (
      Object.keys(winShape).some(
        (prop) => winShape[prop] !== this.#winData.shape[prop]
      )
    ) {
      this.#winData.shape = winShape;

      const index = this.getWindowIndexFromId(this.#id);
      this.#windows[index].shape = winShape;

      if (this.#winShapeChangeCallback) {
        this.#winShapeChangeCallback();
      }
      this.updateWindowsLocalStorage();
    }
  }

  setWinShapeChangeCallback(callback) {
    this.#winShapeChangeCallback = callback;
  }

  setWinChangeCallback(callback) {
    this.#winChangeCallback = callback;
  }

  getWindows() {
    return this.#windows;
  }

  getThisWindowData() {
    return this.#winData;
  }

  getThisWindowID() {
    return this.#id;
  }
}

export default WindowManager;
