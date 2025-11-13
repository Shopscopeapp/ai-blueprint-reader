"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, Loader2, X, FileText, Image as ImageIcon, FileType, CheckCircle2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      router.push(`/chat/${data.blueprint.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/acad": [".dwg"],
      "application/x-dwg": [".dwg"],
      "image/vnd.dwg": [".dwg"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return FileText;
    if (['png', 'jpg', 'jpeg'].includes(ext || '')) return ImageIcon;
    if (['dwg', 'dxf'].includes(ext || '')) return FileType;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-16 text-center cursor-pointer
          transition-all duration-300 transform
          ${
            isDragActive
              ? "border-cyan-400 bg-cyan-400/10 scale-105 shadow-2xl shadow-cyan-400/30"
              : "border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/5 hover:scale-[1.02]"
          }
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping" />
            </div>
            <p className="text-cyan-300 text-xl font-mono font-bold mb-2">
              {'>'} UPLOADING... {'<'}
            </p>
            <p className="text-cyan-400/60 font-mono text-sm">
              Processing your blueprint file
            </p>
          </div>
        ) : (
          <>
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/50 mx-auto">
                <Upload className="w-10 h-10 text-[#0a0e27]" />
              </div>
              <div className="absolute inset-0 bg-cyan-400/20 rounded-xl animate-ping" />
            </div>
            <p className="text-cyan-300 text-2xl font-bold font-mono mb-3">
              {isDragActive
                ? "DROP FILE TO UPLOAD"
                : "DRAG & DROP BLUEPRINT FILE"}
            </p>
            <p className="text-cyan-400/60 font-mono text-sm mb-4">
              {'>'} OR CLICK TO BROWSE {'<'}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-mono text-cyan-400/50">
              <span>PDF</span>
              <span>•</span>
              <span>PNG</span>
              <span>•</span>
              <span>JPG</span>
              <span>•</span>
              <span>DWG</span>
              <span>•</span>
              <span>DXF</span>
            </div>
          </>
        )}
      </div>

      {uploadedFile && !uploading && (
        <div className="mt-6 relative bg-[#0a0e27]/80 border-2 border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400/20" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/30 flex-shrink-0">
                {(() => {
                  const Icon = getFileIcon(uploadedFile.name);
                  return <Icon className="w-6 h-6 text-[#0a0e27]" />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-cyan-300 font-bold font-mono truncate mb-1">
                  {uploadedFile.name}
                </p>
                <p className="text-cyan-400/60 font-mono text-xs">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
              }}
              className="text-cyan-400/60 hover:text-red-400 transition-colors ml-4 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-500/20 border-2 border-red-500/50 text-red-200 px-6 py-4 rounded-xl font-mono">
          <div className="flex items-center space-x-2">
            <X className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold mb-1">{'>'} UPLOAD ERROR {'<'}</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      {!uploading && !uploadedFile && !error && (
        <div className="mt-8 relative bg-[#0a0e27]/40 border border-cyan-400/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-cyan-300 font-bold font-mono mb-2">
                {'>'} QUICK START {'<'}
              </h4>
              <p className="text-cyan-400/70 font-mono text-sm leading-relaxed">
                Upload your architectural drawing, CAD file, or blueprint image. 
                Once uploaded, you'll be able to ask AI questions about dimensions, 
                materials, design elements, and construction details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


