// 1. NAVIGATION ENGINE
const app = {
    navigate(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById('view-' + viewId);
        if(target) target.classList.add('active');

        const backBtn = document.getElementById('backBtn');
        backBtn.style.display = (viewId === 'home') ? 'none' : 'flex';
        window.scrollTo(0, 0);
    }
};

// 2. THREE.JS 3D SPACE ENGINE
let scene, camera, renderer, stars, planet1, planet2;

function init3D() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCoords = [];
    for(let i=0; i<10000; i++) {
        starCoords.push((Math.random()-0.5)*2000, (Math.random()-0.5)*2000, (Math.random()-0.5)*2000);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));
    stars = new THREE.Points(starGeo, new THREE.PointsMaterial({color: 0xffffff, size: 0.7}));
    scene.add(stars);

    // Planet 1 (Signal - Indigo)
    const p1Geo = new THREE.SphereGeometry(5, 32, 32);
    const p1Mat = new THREE.MeshStandardMaterial({ color: 0x6366f1, emissive: 0x2e1065 });
    planet1 = new THREE.Mesh(p1Geo, p1Mat);
    planet1.position.set(-15, 5, -10);
    scene.add(planet1);

    // Planet 2 (Sentinel - Red)
    const p2Geo = new THREE.SphereGeometry(6, 32, 32);
    const p2Mat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0x450a0a });
    planet2 = new THREE.Mesh(p2Geo, p2Mat);
    planet2.position.set(15, -5, -15);
    scene.add(planet2);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 40;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0005;
    planet1.rotation.y += 0.01;
    planet2.rotation.x += 0.005;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function showToast(msg, type='info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast bg-${type === 'error' ? 'red-500' : 'blue-500'}`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

window.onload = init3D;
