"use server"
import { Marker as MarkerModel, Minute as MinuteModel } from "@/lib/db";
import * as DbTypes from "@/lib/db-types";
import { RootFilterQuery } from "mongoose";

// Interfaces exportadas para tipado externo
export interface Marker extends DbTypes.IMarker {}
export interface Minute extends DbTypes.IMinute {}

// ----------- Formato de respuesta -----------

export interface ResponseRequest<T> {
    msg: string,
    error: number,
    success: boolean,
    result: T | null,
}

function Response<T>(success: boolean, result: T | null, error: number = 0, msg: string = ""): ResponseRequest<T> {
    return {
        success,
        result,
        error,
        msg
    }
}

// Utilidad para limpiar objetos de Mongoose y dejar solo datos planos serializables
function clean<T>(doc: any): T {
    return doc ? JSON.parse(JSON.stringify(doc)) : doc;
}

// ----------- CRUD para Marker -----------

// Crear un nuevo Marker
export async function createMarker(data: Omit<Marker, "id">): Promise<ResponseRequest<Marker|null>> {
    try {
        const marker = await MarkerModel.create(data);
        return Response(true, clean<Marker>(marker), 0, "Marker creado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al crear Marker");
    }
}

// Obtener un Marker por id
export async function getMarker(id: number): Promise<ResponseRequest<Marker|null>> {
    try {
        const marker = await MarkerModel.findOne({ id });
        if (!marker) return Response(false, null, 404, "Marker no encontrado");
        return Response(true, clean<Marker>(marker), 0, "Marker encontrado");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al obtener Marker");
    }
}

// Actualizar un Marker por id
export async function updateMarker(id: number, data: Partial<Omit<Marker, "id">>): Promise<ResponseRequest<Marker|null>> {
    try {
        const marker = await MarkerModel.findOneAndUpdate({ id }, data, { new: true });
        if (!marker) return Response(false, null, 404, "Marker no encontrado");
        return Response(true, clean<Marker>(marker), 0, "Marker actualizado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al actualizar Marker");
    }
}

// Eliminar un Marker por id
export async function deleteMarker(id: number): Promise<ResponseRequest<null>> {
    try {
        const result = await MarkerModel.deleteOne({ id });
        if (result.deletedCount === 1) {
            return Response(true, null, 0, "Marker eliminado correctamente");
        } else {
            return Response(false, null, 404, "Marker no encontrado");
        }
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al eliminar Marker");
    }
}

// Obtener todos los Markers con filtros y operaciones de mongoose
export async function getAllMarkers(
    filter: RootFilterQuery<Marker>,
    options: Record<string, any> = {}
): Promise<ResponseRequest<Marker[]>> {
    try {
        const query = MarkerModel.find({ ...filter }, null, options);
        const markers = await query.exec();
        return Response(true, markers.map(m => clean<Marker>(m)), 0, "Markers obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener Markers");
    }
}

// ----------- CRUD para Minute -----------

// Crear un nuevo Minute
export async function createMinute(data: Omit<Minute, "id">): Promise<ResponseRequest<Minute|null>> {
    try {
        const minute = await MinuteModel.create(data);
        return Response(true, clean<Minute>(minute), 0, "Minute creado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al crear Minute");
    }
}

// Obtener un Minute por id
export async function getMinute(id: number): Promise<ResponseRequest<Minute|null>> {
    try {
        const minute = await MinuteModel.findOne({ id });
        if (!minute) return Response(false, null, 404, "Minute no encontrado");
        return Response(true, clean<Minute>(minute), 0, "Minute encontrado");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al obtener Minute");
    }
}

// Actualizar un Minute por id
export async function updateMinute(id: number, data: Partial<Omit<Minute, "id">>): Promise<ResponseRequest<Minute|null>> {
    try {
        const minute = await MinuteModel.findOneAndUpdate({ id }, data, { new: true });
        if (!minute) return Response(false, null, 404, "Minute no encontrado");
        return Response(true, clean<Minute>(minute), 0, "Minute actualizado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al actualizar Minute");
    }
}

// Eliminar un Minute por id
export async function deleteMinute(id: number): Promise<ResponseRequest<null>> {
    try {
        const result = await MinuteModel.deleteOne({ id });
        if (result.deletedCount === 1) {
            return Response(true, null, 0, "Minute eliminado correctamente");
        } else {
            return Response(false, null, 404, "Minute no encontrado");
        }
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al eliminar Minute");
    }
}

// Obtener todos los Minute con filtros y operaciones de mongoose
export async function getAllMinutes(
    filter: RootFilterQuery<Minute> = {},
    options: Record<string, any> = {}
): Promise<ResponseRequest<Minute[]>> {
    try {
        const query = MinuteModel.find(filter, null, {...options}).lean();
        const minutes = await query.exec();

        console.log(minutes)
        
        return Response(true, minutes.map(m => clean<Minute>(m)), 0, "Minutes obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener Minutes");
    }
}

