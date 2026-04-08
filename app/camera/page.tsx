import CameraCapture from '../../components/cameraCapture';

export default function CameraPage() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Camera</h1>
      <CameraCapture />
    </main>
  );
}