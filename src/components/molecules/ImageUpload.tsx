import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
    onUploadSuccess: (urls: string[]) => void;
    maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, maxFiles = 5 }) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files);
        
        if (previewUrls.length + files.length > maxFiles) {
            setError(`Você pode enviar no máximo ${maxFiles} imagens.`);
            return;
        }

        setUploading(true);
        const newUrls: string[] = [];

        try {
            for (const file of files) {
                // Generate a unique file name
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('vehicle-images')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('vehicle-images')
                    .getPublicUrl(filePath);

                newUrls.push(publicUrl);
            }

            const updatedUrls = [...previewUrls, ...newUrls];
            setPreviewUrls(updatedUrls);
            onUploadSuccess(updatedUrls);
        } catch (err: unknown) {
            console.error("Erro no upload de imagem:", err);
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao enviar a imagem.");
        } finally {
            setUploading(false);
            // Reset input so the same files can be selected again if needed
            if (e.target) e.target.value = '';
        }
    };

    const handleRemove = (urlToRemove: string) => {
        const updatedUrls = previewUrls.filter(url => url !== urlToRemove);
        setPreviewUrls(updatedUrls);
        onUploadSuccess(updatedUrls);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-main rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading || previewUrls.length >= maxFiles}
                />
                
                {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-black-main animate-spin" />
                        <p className="text-sm font-bold text-gray-sec uppercase tracking-widest">Enviando...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <UploadCloud className="w-10 h-10 text-gray-sec" />
                        <p className="text-sm font-bold text-gray-sec uppercase tracking-widest text-center">
                            Clique ou arraste imagens<br/>(Máx. {maxFiles})
                        </p>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 text-xs font-bold mt-2">{error}</p>}

            {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border-main group">
                            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); handleRemove(url); }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {idx === 0 && (
                                <span className="absolute bottom-2 left-2 bg-black-main text-white text-[9px] font-bold uppercase px-2 py-1 rounded">
                                    Capa
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
