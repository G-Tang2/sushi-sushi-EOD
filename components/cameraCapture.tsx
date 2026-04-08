'use client';

import { useState } from 'react';
import { createWorker } from 'tesseract.js';

export default function OcrUpload() {
  const [preview, setPreview] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  const preprocessImage = async (file: File): Promise<Blob> => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/image', {
      method: 'POST',
      body: formData,
    })

    const blob = await res.blob()

    return blob;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setStatus('Preprocessing image...');

    const worker = await createWorker('eng');

    try {
      const processedBlob = await preprocessImage(file);

      setStatus('Running OCR...');

    //   await worker.setParameters({
    //     tessedit_pageseg_mode: '6',
    //   });

      const {
        data: { text },
      } = await worker.recognize(processedBlob);

      setText(text);
      setStatus('Done');
    } catch (err) {
      console.error(err);
      setStatus('OCR failed');
    } finally {
      await worker.terminate();
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="max-w-full rounded" />}
      <p>{status}</p>
      <textarea value={text} readOnly rows={12} className="w-full border p-2" />
    </div>
  );
}