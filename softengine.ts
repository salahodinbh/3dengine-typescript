import {Color4, Matrix, Vector2, Vector3} from '@babylonjs/core';

export namespace softengine {
    export class Camera {
        Position: Vector3;
        Target: Vector3;

        constructor(){
            this.Position = Vector3.Zero();
            this.Target = Vector3.Zero();
        }
    }

    export class Mesh {
        Position: Vector3;
        Rotation: Vector3;
        Vertices: Vector3[];

        constructor(public name: string, verticesCount: number){
            this.Position = Vector3.Zero();
            this.Rotation = Vector3.Zero();
            this.Vertices = new Array(verticesCount);
        }
    }

    export class Device{
        private backbuffer: ImageData;
        private workingCanvas: HTMLCanvasElement;
        private workingContext: CanvasRenderingContext2D;
        private workingWidth: number;
        private workingHeight: number;
        private backbufferdata;

        constructor(canvas: HTMLCanvasElement){
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext("2d");
        }

        public clear(): void{
            this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
        }

        public present(): void{
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        }

        public putPixel(x: number, y: number, color: Color4): void{
            this.backbufferdata = this.backbuffer.data;
            var index: number = ((x>>0) + (y>>0) * this.workingWidth) * 4;

            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        }

        public project(coord: Vector3, transMat: Matrix): Vector2{
            var point = Vector3.TransformCoordinates(coord, transMat);
            var x = point.x * this.workingWidth + this.workingWidth / 2.0 >> 0;
            var y = -point.y * this.workingHeight + this.workingHeight / 2.0 >> 0;
            return new Vector2(x, y);
        }

        public drawPoint(point: Vector2): void{
            if (point.x >= 0 || point.x < this.workingWidth || point.y >= 0 || point.y < this.workingHeight){
                this.putPixel(point.x, point.y, new Color4(1, 1, 0, 1));
            }
        }

        public render(camera: Camera, meshes: Mesh[]) : void{
            var viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
            var projectionMatrix = Matrix.PerspectiveFovLH(1.0472, this.workingWidth / this.workingHeight, 0.1, 1000.0);

            for (var index = 0; index < meshes.length; index++){
                var cMesh = meshes[index];
                var worldMatrix = Matrix.RotationYawPitchRoll(cMesh.Rotation.y, cMesh.Rotation.x, cMesh.Rotation.z)
                .multiply(Matrix.Translation(cMesh.Position.x, cMesh.Position.y, cMesh.Position.z));
                
                var transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

                for (var indexVertices = 0; indexVertices<cMesh.Vertices.length; indexVertices++){
                    var projectedPoint = this.project(cMesh.Vertices[indexVertices], transformMatrix);
                    this.drawPoint(projectedPoint);
                }
            }
        }
    }
}