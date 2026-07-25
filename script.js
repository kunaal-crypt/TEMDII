/* ==========================================================================
   THE SUNSHINE VAULT V2 — COMPLETE ENGINE (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. THREE.JS 3D BACKGROUND ENGINE
    // ==========================================
    const canvas = document.getElementById('webgl-canvas');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080b, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTING SYSTEM
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd000, 2, 100);
    pointLight.position.set(10, 20, 15);
    scene.add(pointLight);

    // 3D PAPER PLANE MESH
    const planeGroup = new THREE.Group();
    const planeGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
         0,  0,  4,
        -3,  0, -3,
         0,  1, -2,
         3,  0, -3,
         0, -1, -2
    ]);

    const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 0, 3, 4];
    planeGeometry.setIndex(indices);
    planeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    planeGeometry.computeVertexNormals();

    const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd000,
        emissive: 0x332600,
        flatShading: true,
        side: THREE.DoubleSide
    });

    const paperPlaneMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeGroup.add(paperPlaneMesh);

    const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3 });
    const wireMesh = new THREE.Mesh(planeGeometry, wireMaterial);
    planeGroup.add(wireMesh);

    planeGroup.position.set(0, 0, 10);
    scene.add(planeGroup);

    // 5,000 GPU PARTICLES VORTEX
    const particleCount = 5000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i + 1] = (Math.random() - 0.5) * 120;
        positions[i + 2] = (Math.random() - 0.5) * 120;

        colors[i] = 1.0;
        colors[i + 1] = 0.8 + Math.random() * 0.2;
        colors[i + 2] = 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.35,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // MOUSE INTERACTION & PHYSICS
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // 60 FPS RENDER LOOP
    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        planeGroup.rotation.y = targetX * 1.5;
        planeGroup.rotation.x = -targetY * 1.5;
        planeGroup.rotation.z = -targetX * 0.8;
        planeGroup.position.x = targetX * 10;
        planeGroup.position.y = -targetY * 10;

        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ==========================================
    // 2. DIWALI FIREWORK EXPLOSION
    // ==========================================
    const fireworkBtn = document.getElementById('firework-btn');
    if (fireworkBtn) {
        fireworkBtn.addEventListener('click', () => {
            gsap.to(planeGroup.rotation, {
                x: planeGroup.rotation.x + Math.PI * 2,
                z: planeGroup.rotation.z + Math.PI * 2,
                duration: 1.5,
                ease: "power2.inOut"
            });

            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        });
    }

    // ==========================================
    // 3. MUSIC PLAYER TOGGLE
    // ==========================================
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
            } else {
                bgMusic.play().catch(() => console.log("Audio file missing or blocked"));
                musicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            }
            isPlaying = !isPlaying;
        });
    }

    // ==========================================
    // 4. REALM SWITCHER (POOKIE vs TEMDI)
    // ==========================================
    const realmBtn = document.getElementById('realm-btn');
    let isTemdi = false;

    if (realmBtn) {
        realmBtn.addEventListener('click', () => {
            isTemdi = !isTemdi;
            document.body.classList.toggle('temdi-mode');

            const targetColor = isTemdi ? new THREE.Color(0xff3366) : new THREE.Color(0xffd000);
            gsap.to(planeMaterial.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b, duration: 1 });
            gsap.to(pointLight.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b, duration: 1 });

            realmBtn.innerHTML = isTemdi 
                ? '<i class="fa-solid fa-sun"></i> Switch to Pookie Mode' 
                : '<i class="fa-solid fa-wand-magic-sparkles"></i> Switch to Temdi Mode';
        });
    }

    // ==========================================
    // 5. ROAST & RESPECT GENERATOR
    // ==========================================
    const roasts = [
        '"Re-reads Chapter 14 for the 14th time... still panics that she knows 0%."',
        '"Text reply speed: Study notes = 0.001s. Regular conversation = 3 to 5 business days."',
        '"Sends anonymous notes, blocks the recipient, and acts completely innocent in class. Ninja levels: 100."',
        '"Tries to act like a tough Temdi, but collapses into a soft introverted Pookie the moment someone is nice."'
    ];

    const respects = [
        '"The most loyal and protective best friend you could ever ask for."',
        '"Scored top marks while panicking the entire week before—absolute academic legend."',
        '"Unmasked herself on Diwali 2024 and instantly made the year 10x better."',
        '"Irreplaceable 10/10 bestie. March 10th status locked forever."'
    ];

    const quoteOutput = document.getElementById('quote-output');
    const roastBtn = document.getElementById('roast-trigger');
    const respectBtn = document.getElementById('respect-trigger');

    if (roastBtn) {
        roastBtn.addEventListener('click', () => {
            const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
            quoteOutput.textContent = randomRoast;
        });
    }

    if (respectBtn) {
        respectBtn.addEventListener('click', () => {
            const randomRespect = respects[Math.floor(Math.random() * respects.length)];
            quoteOutput.textContent = randomRespect;
        });
    }

    // ==========================================
    // 6. 2 AM PANIC PREDICTOR SLIDER
    // ==========================================
    const slider = document.getElementById('panic-slider');
    const sliderVal = document.getElementById('slider-val');
    const panicResult = document.getElementById('panic-result');

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            sliderVal.textContent = `${val}%`;

            if (val < 30) {
                panicResult.textContent = "Status: Calm & Relaxed (Rare Niharika moment!)";
            } else if (val < 70) {
                panicResult.textContent = "Status: Re-reading Chapter 14 for the 12th time...";
            } else {
                panicResult.textContent = "Status: 2 AM Full Panic! (Predicted Exam Score: 98%+)";
            }
        });
    }

    // ==========================================
    // 7. GOLDEN DIPLOMA MODAL & SPARKLE BURST
    // ==========================================
    const claimBtn = document.getElementById('claim-cert-btn');
    const certModal = document.getElementById('cert-modal');
    const closeModal = document.getElementById('close-modal');

    if (claimBtn && certModal) {
        claimBtn.addEventListener('click', () => {
            certModal.classList.add('active');
            
            // Trigger Golden Confetti Explosion
            confetti({
                particleCount: 150,
                spread: 100,
                colors: ['#ffd000', '#ffffff', '#ffae00'],
                origin: { y: 0.5 }
            });
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            certModal.classList.remove('active');
        });
    }
});
