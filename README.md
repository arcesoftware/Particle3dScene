# Multiple Window 3D Particle Simulation using Three.js

## Introduction
This project showcases an innovative method for building and coordinating a 3D scene across multiple browser windows, leveraging the power of Three.js and localStorage. 
Tailored for developers intrigued by cutting-edge web graphics and proficient window management techniques, this project offers a unique exploration into the realm of advanced web development.

## Features
- Three.js-powered 3D Scene: Utilizes the Three.js library to facilitate the creation and rendering of captivating 3D scenes.
- Cross-Window Scene Synchronization: Achieves seamless synchronization of 3D scenes across multiple browser windows for a unified and immersive experience.
- Dynamic Window Management: Implements dynamic window management and state synchronization through localStorage, enhancing user interaction and visual consistency.

## Installation
Clone the repository and open `index.html` in your browser to start exploring the 3D scene.

```
git clone https://github.com/arcesoftware/Particle3dScene
```
## Usage
The main application logic is contained within `main.js` and `WindowManager.js`. The 3D scene is rendered in `index.html`, which serves as the entry point of the application.

## Structure and Components
- `index.html`: Entry point that sets up the HTML structure and includes the Three.js library and the main script.
- `WindowManager.js`: Core class managing window creation, synchronization, and state management across multiple windows.
- `main.js`: Contains the logic for initializing the 3D scene, handling window events, and rendering the scene.
- `three.r124.min.js`: Minified version of the Three.js library used for 3D graphics rendering.

## Detailed Functionality
- `WindowManager.js` handles the lifecycle of multiple browser windows, including creation, synchronization, and removal. It uses localStorage to maintain state across windows.
- `main.js` initializes the 3D scene using Three.js, manages the window's resize events, and updates the scene based on window interactions.

## Contributing
Contributions to enhance or expand the project are welcome. Feel free to fork the repository, make changes, and submit pull requests.

## License
This project is open-sourced under the GNU General Public License v2.0.

## Acknowledgments
- The Three.js team for their comprehensive 3D library.
- xbgstaal/multipleWindow3dScene for the initial project.

## Contact
For more information and updates, follow: 
- [@_RICHCOAST_](https://twitter.com/richcoast5) on Twitter.
- [@_RICHCOAST_](https://youtube.com/richcoast) on YouTube.

