"use server"
import { User } from "./db";
import { Class2Json, Response, ResponseRequest } from "./utils";
import { IUser } from "./db-types";

// Crear un nuevo usuario
export async function createUser(data: IUser): Promise<ResponseRequest<IUser|null>> {
    try {
        const user = await User.create(data);
        return Response(true, Class2Json<IUser>(user), 0, "Usuario creado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al crear usuario");
    }
}

// Actualizar un usuario por nombre
export async function updateUser(user: string, data: Partial<Omit<IUser, "user">>): Promise<ResponseRequest<IUser|null>> {
    delete (data as any)._id
    console.log("update user:", user, data)
    try {
        const updated = await User.findOneAndUpdate({ user }, data, { new: true });
        if (!updated) return Response(false, null, 404, "Usuario no encontrado");
        return Response(true, Class2Json<IUser>(updated), 0, "Usuario actualizado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al actualizar usuario");
    }
}

// Obtener un usuario por nombre
export async function getUser(user: string): Promise<ResponseRequest<IUser|null>> {
    try {
        const found = await User.findOne({ user });
        if (!found) return Response(false, null, 404, "Usuario no encontrado");
        return Response(true, Class2Json<IUser>(found), 0, "Usuario encontrado");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al obtener usuario");
    }
}

// Obtener todos los usuarios
export async function getAllUsers(): Promise<ResponseRequest<IUser[]>> {
    try {
        const users = await User.find();
        return Response(true, Class2Json<IUser[]>(users), 0, "Usuarios obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener usuarios");
    }
}