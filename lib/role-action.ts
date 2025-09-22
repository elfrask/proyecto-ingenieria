"use server"
import { Role, User } from "./db";
import { Class2Json, Response, ResponseRequest } from "./utils";
import { IRole } from "./db-types";

// Crear un nuevo rol
export async function createRole(data: IRole): Promise<ResponseRequest<IRole|null>> {
    try {
        const role = await Role.create(data);
        return Response(true, Class2Json<IRole>(role), 0, "Rol creado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al crear rol");
    }
}

// Actualizar un rol por nombre
export async function updateRole(name: string, data: Partial<Omit<IRole, "name">>): Promise<ResponseRequest<IRole|null>> {
    try {
        const role = await Role.findOneAndUpdate({ name }, data, { new: true });
        if (!role) return Response(false, null, 404, "Rol no encontrado");
        return Response(true, Class2Json<IRole>(role), 0, "Rol actualizado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al actualizar rol");
    }
}

// Obtener un rol por nombre
export async function getRole(name: string): Promise<ResponseRequest<IRole|null>> {
    try {
        const role = await Role.findOne({ name });
        if (!role) return Response(false, null, 404, "Rol no encontrado");
        return Response(true, Class2Json<IRole>(role), 0, "Rol encontrado");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al obtener rol");
    }
}

// Obtener todos los roles
export async function getAllRoles(): Promise<ResponseRequest<IRole[]>> {
    try {
        const roles = await Role.find();
        return Response(true, Class2Json<IRole[]>(roles), 0, "Roles obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener roles");
    }
}

