import WindowManager from './WindowManager.js'



const t = THREE;
let camera, scene, renderer, world;
let near, far;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let cubes = [];
let sceneOffsetTarget = {x: 0, y: 0};
let sceneOffset = {x: 0, y: 0};

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();

let internalTime = getTime();
let windowManager;
let initialized = false;

// get time in seconds since beginning of the day (so that all windows use the same time)
function getTime ()
{
	return (new Date().getTime() - today) / 1000.0;
}


if (new URLSearchParams(window.location.search).get("clear"))
{
	localStorage.clear();
}
else
{
	// this code is essential to circumvent that some browsers preload the content of some pages before you actually hit the url
	document.addEventListener("visibilitychange", () =>
	{
		if (document.visibilityState != 'hidden' && !initialized)
		{
			init();
		}
	});

	window.onload = () => {
		if (document.visibilityState != 'hidden')
		{
			init();
		}
	};

	function init ()
	{
		initialized = true;

		// add a short timeout because window.offsetX reports wrong values before a short period
		setTimeout(() => {
			setupScene();
			setupWindowManager();
			resize();
			updateWindowShape(false);
			render();
			window.addEventListener('resize', resize);
		}, 500)
	}

	function setupScene ()
	{
		camera = new t.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);

		camera.position.z = 2.5;
		near = camera.position.z - .5;
		far = camera.position.z + 0.5;

		scene = new t.Scene();
		scene.background = new t.Color(0.0);
		scene.add( camera );

		renderer = new t.WebGLRenderer({antialias: true, depthBuffer: true});
		renderer.setPixelRatio(pixR);

	  	world = new t.Object3D();
		scene.add(world);

		renderer.domElement.setAttribute("id", "scene");
		document.body.appendChild( renderer.domElement );
	}

	function setupWindowManager ()
	{
		windowManager = new WindowManager();
		windowManager.setWinShapeChangeCallback(updateWindowShape);
		windowManager.setWinChangeCallback(windowsUpdated);

		// here you can add your custom metadata to each windows instance
		let metaData = {foo: "bar"};

		// this will init the windowmanager and add this window to the centralised pool of windows
		windowManager.init(metaData);

		// call update windows initially (it will later be called by the win change callback)
		windowsUpdated();
	}

	function windowsUpdated ()
	{
		updateNumberOfCubes();
	}

    function updateNumberOfCubes() {
      let wins = windowManager.getWindows();

      // Remove all existing objects (particle spheres)
      world.children.forEach((obj) => {
        world.remove(obj);
      });

      // Clear the cubes array
      cubes = [];

      // Add a moving dusty particle sphere based on the current window setup
      for (let i = 0; i < wins.length; i++) {
        let win = wins[i];

        let c = new t.Color();
        c.setHSL(i * 0.1, 1.0, 0.5);

        let s = 100 + i * 50;

        // Create a sphere with particles
        let particleSphereGeometry = new t.BufferGeometry();
        let particleSphereMaterial = new t.PointsMaterial({
          color: c,
          size: 3,
          transparent: true,
          opacity: 0.7,
        });

        let particles = 500; // Adjust the number of particles as needed

        let positions = new Float32Array(particles * 3);
        let velocities = new Float32Array(particles * 3);

        for (let j = 0; j < particles; j++) {
          let u = Math.random() * Math.PI * 2;
          let v = Math.random() * Math.PI * 2;
          let radius = s / 2 + Math.random() * s / 4;

          positions[j * 3] = Math.cos(u) * (radius + Math.random() * 5);
          positions[j * 3 + 1] = Math.sin(u) * (radius + Math.random() * 5);
          positions[j * 3 + 2] = Math.sin(v) * (radius + Math.random() * 5);

          // Assign random initial velocities to particles
          velocities[j * 3] = Math.random() - 0.5;
          velocities[j * 3 + 1] = Math.random() - 0.5;
          velocities[j * 3 + 2] = Math.random() - 0.5;
        }

        particleSphereGeometry.addAttribute('position', new t.BufferAttribute(positions, 3));
        particleSphereGeometry.addAttribute('velocity', new t.BufferAttribute(velocities, 3));

        let particleSphere = new t.Points(particleSphereGeometry, particleSphereMaterial);
        particleSphere.position.x = win.shape.x + win.shape.w * 0.5;
        particleSphere.position.y = win.shape.y + win.shape.h * 0.5;

        world.add(particleSphere);
        cubes.push(particleSphere);
      }
    }

    function updateWindowShape(easing = true) {
      // Store the actual offset in a proxy that we update against in the render function
      sceneOffsetTarget.x = -window.screenX;
      sceneOffsetTarget.y = -window.screenY;

      if (!easing) {
        sceneOffset.x = sceneOffsetTarget.x;
        sceneOffset.y = sceneOffsetTarget.y;
      }
    }

    function render() {
      const currentTime = getTime();
      windowManager.update();

      // Calculate the new position based on the delta between the current offset and new offset times a falloff value
      const falloff = 0.05;
      sceneOffset.x += (sceneOffsetTarget.x - sceneOffset.x) * falloff;
      sceneOffset.y += (sceneOffsetTarget.y - sceneOffset.y) * falloff;

      // Set the world position to the offset
      world.position.set(sceneOffset.x, sceneOffset.y, 0);

      const wins = windowManager.getWindows();

      // Loop through all cubes and update their positions based on current window positions
      cubes.forEach((cube, i) => {
        const win = wins[i];
        const deltaTime = currentTime + i * 0.2;

        const posTarget = {
          x: win.shape.x + win.shape.w * 0.5,
          y: win.shape.y + win.shape.h * 0.5,
        };

        cube.position.x += (posTarget.x - cube.position.x) * falloff;
        cube.position.y += (posTarget.y - cube.position.y) * falloff;
        cube.rotation.x = deltaTime * 0.5;
        cube.rotation.y = deltaTime * 0.3;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }


	// resize the renderer to fit the window size
	function resize ()
	{
		let width = window.innerWidth;
		let height = window.innerHeight

		camera = new t.OrthographicCamera(0, width, 0, height, -10000, 10000);
		camera.updateProjectionMatrix();
		renderer.setSize( width, height );
	}
}