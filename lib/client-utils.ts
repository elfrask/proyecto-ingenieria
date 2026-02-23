"use client";

import { toast } from "sonner";
import { _ZodType, ZodError } from "zod";

// import { extractTextFromPDF } from "./pdf-actions";
export function dataURLtoFile(dataurl: string, filename: string, mimeType: string) {
    var arr = dataurl.split(','),
        mime = (arr[0] as any).match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mimeType});
}

export function ZodPassValidate(zo: _ZodType, value: any) {
    let _ok = true;
    let _msg = "";

    try {

        zo.parse(value)
        
    } catch (error) {

        const err = error as ZodError;
        _ok = false;
        _msg = err?.message ? String(err.message) : JSON.stringify(err);
        _msg = (JSON.parse(_msg) as ZodError[]).map(x=> x.message).join("\n")


    }
    

    return {ok: _ok, msg: _msg}
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // Eliminar el prefijo (ej: "data:image/jpeg;base64,")
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };

        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

export function downloadBase64File(base64Data: string, fileName: string, mimeType: string) {
   
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,` + base64Data;

    link.download = fileName; 
    document.body.appendChild(link);
    link.click(); 

    document.body.removeChild(link);
}

export function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function fileToText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // Eliminar el prefijo (ej: "data:image/jpeg;base64,")
            const base64String = (reader.result as string)
            resolve(base64String);
        };

        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}

export function fileToBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // Eliminar el prefijo (ej: "data:image/jpeg;base64,")
            const base64String = (reader.result as ArrayBuffer)
            resolve(base64String);
        };

        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(file);
    });
}






export type ValidAcceptTypes =
    | "image/*"
    | "audio/*"
    | "video/*"
    | ".pdf,.doc,.docx"
    // | ".pdf,.doc,.docx"
    | "application/pdf"
    | "text/plain"
    | "application/msword"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | (string & {});

export function getFile(accept?: ValidAcceptTypes) {
    // Lista de tipos MIME comunes para input file


    return new Promise<File | undefined>((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept || "*";

        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            // console.log(event.target.files[0])
            // console.log("getFile", file)
            resolve(file);
        };

        // Manejar el evento de cancelación
        const handleCancel = () => {
            window.removeEventListener('focus', handleCancel);
            setTimeout(() => {

                
                // Si después de un breve tiempo no se ha resuelto la promesa
                // asumimos que fue cancelado
                resolve(undefined);
            }, 2000);
        };

        // Escuchar cuando la ventana recupera el foco (indicando que el diálogo se cerró)
        window.addEventListener('focus', handleCancel);

        input.click();

        return () => {
            window.removeEventListener('focus', handleCancel);

        }
    });
}


export async function extractTextFromFileDocument(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
        switch (extension) {
            // Documentos de texto plano
            case 'txt':
                return await readTextFile(file);

            // Documentos PDF
            case 'pdf':
                // return await ClientextractTextFromPDF(file);
                // return await extractTextFromPDF(file);
                return "la extracción de texto por pdf ha sido deshabilitado de este medio por problemas técnicos"

            // Documentos Word (docx)
            case 'docx':
                return "Documento no disponible"
            default:
                return await readTextFile(file);
        }
    } catch (error) {
        console.error(`Error al extraer texto del archivo: ${error}`);
        throw new Error(`No se pudo extraer texto del archivo ${file.name}`);
    }
}

// Funciones auxiliares para cada tipo de archivo
export async function readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(new Error('Error al leer el archivo'));
        reader.readAsText(file);
    });
}

export const formatBytes = (bytes: number) => {
    // Si los bytes son 0 o negativos, devuelve 0 B
    if (bytes <= 0) {
        return "0 B";
    }

    // Unidades estándar (IEC/ISO)
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    // Logaritmo en base 1024 para encontrar el índice de la unidad
    // Math.floor asegura que siempre empezamos con una unidad más pequeña (ej: 1023 B -> 1 KB)
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    // 1. Calcula el valor en la nueva unidad (ej: bytes / 1024^i)
    const value = bytes / Math.pow(1024, i);

    // 2. Determina cuántos decimales necesitamos para tener 3 dígitos significativos
    let precision;
    if (value < 10) {
        // Si el valor es < 10 (ej: 1.234), queremos 2 decimales (3 dígitos: 1.23)
        precision = 2;
    } else if (value < 100) {
        // Si el valor es < 100 (ej: 12.34), queremos 1 decimal (3 dígitos: 12.3)
    	precision = 1;
    } else {
        // Si el valor es >= 100 (ej: 123.4), queremos 0 decimales (3 dígitos: 123)
        precision = 0;
    }
    
    // 3. Redondea el valor y concatena la unidad
    // toFixed(precision) devuelve una cadena que asegura el número exacto de decimales.
    return `${value.toFixed(precision)} ${units[i]}`;
}

export const formatAmount = (bytes: number) => {
    // Si los bytes son 0 o negativos, devuelve 0 B
    let negative = bytes < 0;

    if (negative) {
        bytes = bytes * -1; 
    }

    if (bytes <= 0) {
        return "0";
    }

    // Unidades estándar (IEC/ISO)
    const units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    
    // Logaritmo en base 1000 para encontrar el índice de la unidad
    // Math.floor asegura que siempre empezamos con una unidad más pequeña (ej: 1023 B -> 1 KB)
    const i = Math.floor(Math.log(bytes) / Math.log(1000));
    
    // 1. Calcula el valor en la nueva unidad (ej: bytes / 1024^i)
    const value = bytes / Math.pow(1000, i);

    // 2. Determina cuántos decimales necesitamos para tener 3 dígitos significativos
    let precision;
    if (value < 10) {
        // Si el valor es < 10 (ej: 1.234), queremos 2 decimales (3 dígitos: 1.23)
        precision = 2;
    } else if (value < 100) {
        // Si el valor es < 100 (ej: 12.34), queremos 1 decimal (3 dígitos: 12.3)
    	precision = 1;
    } else {
        // Si el valor es >= 100 (ej: 123.4), queremos 0 decimales (3 dígitos: 123)
        precision = 0;
    }
    
    // 3. Redondea el valor y concatena la unidad
    // toFixed(precision) devuelve una cadena que asegura el número exacto de decimales.
    return `${negative?"- ":""}${value.toFixed(precision)}${units[i]}`;
}

export const Notify = {
    sucess: (title: string, description?: string) => toast(title, {
        description,
    }) 
}