import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "afterburner" is now active!');

    let disposable = vscode.commands.registerCommand('afterburner.helloWorld', () => {
        // Create and show a new webview
        const panel = vscode.window.createWebviewPanel(
            'afterburnerWebview', // Identifies the type of the webview. Used internally
            'Afterburner Webview', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in
            { enableScripts: true } // Webview options
        );

        // And set its HTML content
        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Afterburner Simulator</title>
    <style>
        body, html { margin: 0; padding: 0; overflow: hidden; background-color: #000; }
        canvas { display: block; width: 100vw; height: 100vh; }
        #crosshair {
            position: absolute; top: 50%; left: 50%;
            width: 20px; height: 20px;
            margin-top: -10px; margin-left: -10px;
            border: 2px solid rgba(0, 255, 255, 0.5);
            border-radius: 50%; pointer-events: none;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div id="crosshair"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000510);
        scene.fog = new THREE.FogExp2(0x000510, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 50, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0x00ffff, 0.8);
        dirLight.position.set(100, 200, 50);
        scene.add(dirLight);

        const dirLight2 = new THREE.DirectionalLight(0xff00ff, 0.8);
        dirLight2.position.set(-100, 100, -50);
        scene.add(dirLight2);

        const citySize = 2000;
        const numBuildings = 10000;
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.translate(0, 0.5, 0);
        const material = new THREE.MeshPhongMaterial({ color: 0x111122, flatShading: true });
        
        const instancedMesh = new THREE.InstancedMesh(geometry, material, numBuildings);
        
        const dummy = new THREE.Object3D();
        for (let i = 0; i < numBuildings; i++) {
            const x = (Math.random() - 0.5) * citySize;
            const z = (Math.random() - 0.5) * citySize;
            const width = Math.random() * 10 + 5;
            const depth = Math.random() * 10 + 5;
            const height = Math.random() * Math.random() * 80 + 10;
            
            dummy.position.set(x, 0, z);
            dummy.scale.set(width, height, depth);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        scene.add(instancedMesh);

        const gridHelper = new THREE.GridHelper(citySize, 100, 0x00ffff, 0x001133);
        gridHelper.position.y = 0.1;
        scene.add(gridHelper);

        let targetPitch = 0;
        let targetYaw = 0;
        let flightSpeed = 1.0;

        document.addEventListener('mousemove', (e) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = -(e.clientY / window.innerHeight) * 2 + 1;
            targetYaw = -nx * 1.5;
            targetPitch = ny * 1.5;
        });
        
        document.addEventListener('mousedown', () => flightSpeed = 3.0);
        document.addEventListener('mouseup', () => flightSpeed = 1.0);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        
        function animate() {
            requestAnimationFrame(animate);

            euler.setFromQuaternion(camera.quaternion);
            euler.x += (targetPitch - euler.x) * 0.05;
            euler.y += (targetYaw - euler.y) * 0.05;
            euler.z = -targetYaw * 0.5;
            
            camera.quaternion.setFromEuler(euler);
            camera.translateZ(-flightSpeed);

            if (camera.position.x > citySize / 2) camera.position.x -= citySize;
            if (camera.position.x < -citySize / 2) camera.position.x += citySize;
            if (camera.position.z > citySize / 2) camera.position.z -= citySize;
            if (camera.position.z < -citySize / 2) camera.position.z += citySize;
            
            if (camera.position.y < 2) {
                camera.position.y = 2;
                targetPitch = Math.max(0, targetPitch);
            }

            renderer.render(scene, camera);
        }

        animate();
    </script>
</body>
</html>\`;
}

export function deactivate() {}
