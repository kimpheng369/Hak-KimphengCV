class Antigravity {
  constructor(container, options = {}) {
    this.container = container;
    this.count = options.count || 200; // Increased default count for full screen
    this.magnetRadius = options.magnetRadius || 17;
    this.ringRadius = options.ringRadius || 12;
    this.waveSpeed = options.waveSpeed || 2;
    this.waveAmplitude = options.waveAmplitude || 1;
    this.particleSize = options.particleSize || 1.5;
    this.lerpSpeed = options.lerpSpeed || 0.05;
    this.color = options.color || '#00fbfc';
    this.autoAnimate = options.autoAnimate !== undefined ? options.autoAnimate : true;
    this.particleVariance = options.particleVariance !== undefined ? options.particleVariance : 1;
    this.rotationSpeed = options.rotationSpeed !== undefined ? options.rotationSpeed : 0;
    this.depthFactor = options.depthFactor !== undefined ? options.depthFactor : 1;
    this.pulseSpeed = options.pulseSpeed || 3;
    this.particleShape = options.particleShape || 'capsule';
    this.fieldStrength = options.fieldStrength || 10;

    this.lastMousePos = { x: 0, y: 0 };
    this.lastMouseMoveTime = 0;
    this.virtualMouse = { x: 0, y: 0 };
    this.pointer = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    
    // Camera settings corresponding to <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
    const fov = 35;
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 50);

    // Renderer (transparent background)
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // Geometry matching the React Three Fiber mesh choices
    let geometry;
    if (this.particleShape === 'capsule') {
      geometry = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
    } else if (this.particleShape === 'sphere') {
      geometry = new THREE.SphereGeometry(0.2, 16, 16);
    } else if (this.particleShape === 'box') {
      geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    } else if (this.particleShape === 'tetrahedron') {
      geometry = new THREE.TetrahedronGeometry(0.3);
    } else {
      geometry = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
    }

    // Material
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(this.color) });

    // Instanced Mesh
    this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
    this.scene.add(this.mesh);

    this.dummy = new THREE.Object3D();

    // Calculate viewport size in 3D space
    this.updateViewportSize();
    this.initParticles();

    // Event listeners
    window.addEventListener('resize', this.onResize.bind(this));
    
    // Watch mouse events globally on the window
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });

    this.animate();
  }

  updateViewportSize() {
    const fovRad = (this.camera.fov * Math.PI) / 180;
    // visible height at distance d = 50
    this.viewportHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.z;
    this.viewportWidth = this.viewportHeight * this.camera.aspect;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;

      // Random points dispersed across the 3D viewport dimensions
      const x = (Math.random() - 0.5) * this.viewportWidth;
      const y = (Math.random() - 0.5) * this.viewportHeight;
      const z = (Math.random() - 0.5) * 20;

      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      this.particles.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        randomRadiusOffset
      });
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.updateViewportSize();
  }

  onMouseMove(e) {
    // Map client coordinates directly to window dimension bounds
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      this.pointer.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = this.clock.getElapsedTime();

    // Check if mouse has moved
    const mouseDist = Math.sqrt(
      Math.pow(this.pointer.x - this.lastMousePos.x, 2) + 
      Math.pow(this.pointer.y - this.lastMousePos.y, 2)
    );

    if (mouseDist > 0.001) {
      this.lastMouseMoveTime = Date.now();
      this.lastMousePos = { x: this.pointer.x, y: this.pointer.y };
    }

    let destX = (this.pointer.x * this.viewportWidth) / 2;
    let destY = (this.pointer.y * this.viewportHeight) / 2;

    // Trigger autoAnimate mode if mouse is idle for 2 seconds
    if (this.autoAnimate && Date.now() - this.lastMouseMoveTime > 2000) {
      destX = Math.sin(time * 0.5) * (this.viewportWidth / 4);
      destY = Math.cos(time * 0.5 * 2) * (this.viewportHeight / 4);
    }

    // Smooth lerp for virtual mouse coords
    const smoothFactor = 0.05;
    this.virtualMouse.x += (destX - this.virtualMouse.x) * smoothFactor;
    this.virtualMouse.y += (destY - this.virtualMouse.y) * smoothFactor;

    const targetX = this.virtualMouse.x;
    const targetY = this.virtualMouse.y;

    const globalRotation = time * this.rotationSpeed;

    this.particles.forEach((particle, i) => {
      let { t, speed, mx, my, mz, cz, randomRadiusOffset } = particle;

      t = particle.t += speed / 2;

      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetPos = { x: mx, y: my, z: mz * this.depthFactor };

      // Magnetization ring physics
      if (dist < this.magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;
        const wave = Math.sin(t * this.waveSpeed + angle) * (0.5 * this.waveAmplitude);
        const deviation = randomRadiusOffset * (5 / (this.fieldStrength + 0.1));
        const currentRingRadius = this.ringRadius + wave + deviation;

        targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetPos.z = mz * this.depthFactor + Math.sin(t) * (1 * this.waveAmplitude * this.depthFactor);
      }

      // Smooth coordinate transition towards target
      particle.cx += (targetPos.x - particle.cx) * this.lerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * this.lerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * this.lerpSpeed;

      // Position Object3D dummy
      this.dummy.position.set(particle.cx, particle.cy, particle.cz);

      // Orientation relative to projected mouse target
      this.dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      this.dummy.rotateX(Math.PI / 2);

      // Pulse scaling
      const currentDistToMouse = Math.sqrt(
        Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
      );

      const distFromRing = Math.abs(currentDistToMouse - this.ringRadius);
      let scaleFactor = 1 - distFromRing / 10;
      scaleFactor = Math.max(0, Math.min(1, scaleFactor));

      const finalScale = scaleFactor * (0.8 + Math.sin(t * this.pulseSpeed) * 0.2 * this.particleVariance) * this.particleSize;
      this.dummy.scale.set(finalScale, finalScale, finalScale);

      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    });

    this.mesh.instanceMatrix.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }
}
