"use server";
import { RootFilterQuery } from "mongoose";
import { MinuteType } from "./db";
import { IMinuteType } from "./db-types";

// Utilidad para limpiar objetos de Mongoose y dejar solo datos planos serializables
function clean<T>(doc: any): T {
    return doc ? JSON.parse(JSON.stringify(doc)) : doc;
}

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

// Obtener todos los tipos de minutas (con filtro opcional)
export async function getAllMinuteTypes(
    filter: RootFilterQuery<IMinuteType> = {}
): Promise<ResponseRequest<IMinuteType[]>> {
    try {
        const types = await MinuteType.find(filter);
        return Response(true, types.map<IMinuteType>(clean), 0, "Tipos de minutas obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener tipos de minutas");
    }
}

// Crear un nuevo tipo de minuta
export async function createMinuteType(data: Omit<IMinuteType, "id">): Promise<ResponseRequest<IMinuteType|null>> {
    try {
        const type = await MinuteType.create(data);
        return Response(true, clean<IMinuteType>(type), 0, "Tipo de minuta creado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al crear tipo de minuta");
    }
}

// Actualizar un tipo de minuta por id
export async function updateMinuteType(
    id: number,
    data: Partial<Omit<IMinuteType, "id">>
): Promise<ResponseRequest<IMinuteType|null>> {
    try {
        const type = await MinuteType.findOneAndUpdate({ id }, data, { new: true });
        if (!type) return Response(false, null, 404, "Tipo de minuta no encontrado");
        return Response(true, clean<IMinuteType>(type), 0, "Tipo de minuta actualizado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al actualizar tipo de minuta");
    }
}

// Eliminar un tipo de minuta por id
export async function deleteMinuteType(id: number): Promise<ResponseRequest<null>> {
    try {
        const result = await MinuteType.deleteOne({ id });
        if (result.deletedCount === 1) {
            return Response(true, null, 0, "Tipo de minuta eliminado correctamente");
        } else {
            return Response(false, null, 404, "Tipo de minuta no encontrado");
        }
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al eliminar tipo de minuta");
    }
}