import { useRef, useState } from 'react';

export default function DropZone({ onUpload, hasImage }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file) {
    if (!file || !file.type.match(/^image\/(png|jpeg)$/)) return;
    const img = new Image();
    img.onload = () => onUpload(img, file);
    img.src = URL.createObjectURL(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function onDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onFileChange(e) {
    handleFile(e.target.files[0]);
    e.target.value = '';
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-blue-400 bg-blue-50'
          : hasImage
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <div className="text-gray-400 text-3xl mb-2">&#8682;</div>
      <p className="text-sm font-medium text-gray-700">
        {hasImage ? 'Image uploaded. Click to replace' : 'Drag and drop files here or click upload'}
      </p>
      <p className="text-xs text-gray-400 mt-1">Support formats: png and jpeg</p>
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
