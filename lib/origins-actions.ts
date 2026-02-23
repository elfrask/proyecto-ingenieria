"use server"
import { Origin, OriginElement } from "./db";
import { IOrigins, IOriginsElement } from "./db-types";
import { Response, ResponseRequest } from "./utils";


// Crear un nuevo origen
export async function createOrigin(data: IOrigins): Promise<ResponseRequest<any>> {
    try {
        const origin = new Origin(data);
        const savedOrigin = await origin.save();
        return Response(true, savedOrigin, 0, "Origen creado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al crear origen");
    }
}

// Leer todos los orígenes
export async function getAllOrigins(): Promise<ResponseRequest<any[]>> {
    try {
        const origins = await Origin.find();
        return Response(true, origins, 0, "Orígenes obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener orígenes");
    }
}

// Leer un origen por ID
export async function getOriginById(id: number): Promise<ResponseRequest<any>> {
    try {
        const origin = await Origin.findById(id);
        if (!origin) return Response(false, null, 404, "Origen no encontrado");
        return Response(true, origin, 0, "Origen encontrado");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al obtener origen");
    }
}

// Actualizar un origen por ID
export async function updateOrigin(id: number, data: IOrigins): Promise<ResponseRequest<any>> {
    console.log("actualizando:", data)
    try {
        const updatedOrigin = await Origin.findOne({id});
        
        if (!updatedOrigin) return Response(false, null, 404, "Origen no encontrado");
        Object.assign(updatedOrigin, data);
        updatedOrigin.save();
        return Response(true, updatedOrigin, 0, "Origen actualizado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al actualizar origen");
    }
}

// Eliminar un origen por ID
export async function deleteOrigin(id: number): Promise<ResponseRequest<null>> {
    try {
        const deletedOrigin = await Origin.findByIdAndDelete(id);
        if (!deletedOrigin) return Response(false, null, 404, "Origen no encontrado");
        return Response(true, null, 0, "Origen eliminado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al eliminar origen");
    }
}

// Crear un nuevo elemento de origen
export async function createOriginElement(data: IOriginsElement): Promise<ResponseRequest<any>> {
    try {
        const originElement = new OriginElement(data);
        const savedElement = await originElement.save();
        return Response(true, savedElement, 0, "Elemento de origen creado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al crear elemento de origen");
    }
}

// Leer todos los elementos de origen
export async function getAllOriginElements(originName: string): Promise<ResponseRequest<IOriginsElement[]>> {
    try {
        const elements = await OriginElement.find({origins: originName}) as IOriginsElement[];
        return Response(true, elements, 0, "Elementos de origen obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener elementos de origen");
    }
}

// Leer un elemento de origen por ID
export async function getOriginElementById(id: number): Promise<ResponseRequest<any>> {
    try {
        const element = await OriginElement.findById(id);
        if (!element) return Response(false, null, 404, "Elemento de origen no encontrado");
        return Response(true, element, 0, "Elemento de origen encontrado");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al obtener elemento de origen");
    }
}

// Leer elementos de origen por origen
export async function getOriginElementsByOrigin(originId: number): Promise<ResponseRequest<any[]>> {
    try {
        const elements = await OriginElement.find({ origins: originId });
        return Response(true, elements, 0, "Elementos de origen obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener elementos de origen por origen");
    }
}

// Actualizar un elemento de origen por ID
export async function updateOriginElement(id: number, data: IOriginsElement): Promise<ResponseRequest<any>> {
    try {
        const updatedElement = await OriginElement.findOne({id});
        if (!updatedElement) return Response(false, null, 404, "Elemento de origen no encontrado");
        Object.assign(updatedElement, data);
        updatedElement.save();
        return Response(true, updatedElement, 0, "Elemento de origen actualizado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al actualizar elemento de origen");
    }
}

// Eliminar un elemento de origen por ID
export async function deleteOriginElement(id: number): Promise<ResponseRequest<null>> {
    try {
        const deletedElement = await OriginElement.findByIdAndDelete(id);
        if (!deletedElement) return Response(false, null, 404, "Elemento de origen no encontrado");
        return Response(true, null, 0, "Elemento de origen eliminado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al eliminar elemento de origen");
    }
}