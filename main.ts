import {softengine} from './softengine';
import {Vector3} from '@babylonjs/core';

var canvas: HTMLCanvasElement; 
var device: softengine.Device;
var mesh: softengine.Mesh;
var meshes: softengine.Mesh[] = [];
var camera: softengine.Camera;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = <HTMLCanvasElement>document.getElementById("frontBuffer");

    mesh = new softengine.Mesh("Cube", 8);
    meshes.push(mesh);

    camera = new softengine.Camera();
    device = new softengine.Device(canvas);

    mesh.Vertices[0] = new Vector3(-1, 1, 1);
    mesh.Vertices[1] = new Vector3(1, 1, 1);
    mesh.Vertices[2] = new Vector3(-1, -1, 1);
    mesh.Vertices[3] = new Vector3(-1, -1, -1);
    mesh.Vertices[4] = new Vector3(-1, 1, -1);
    mesh.Vertices[5] = new Vector3(1, 1, -1);
    mesh.Vertices[6] = new Vector3(1, -1, 1);
    mesh.Vertices[7] = new Vector3(1, -1, -1);

    camera.Position = new Vector3(0, 0, 10);
    camera.Target = Vector3.Zero();

    requestAnimationFrame(drawingLoop);
}

function drawingLoop() {
    device.clear();
    
    mesh.Rotation.x += 0.01;
    mesh.Rotation.y += 0.01;

    device.render(camera, meshes);
    device.present();

    requestAnimationFrame(drawingLoop);
}