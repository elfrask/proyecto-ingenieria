"use server"
import { Role, User } from "./db";
import { Class2Json, Response, ResponseRequest } from "./utils";
import { IRole, None_ReadOnly_ReadAndWrite, PermissionDefault, PermissionInterface, ReadOnly_ReadAndWrite } from "./db-types";

// Crear un nuevo rol
export async function createRole(data: IRole): Promise<ResponseRequest<IRole | null>> {
    try {
        const role = await Role.create(data);
        return Response(true, Class2Json<IRole>(role), 0, "Rol creado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al crear rol");
    }
}

// Actualizar un rol por nombre
export async function updateRole(name: string, data: Partial<Omit<IRole, "name">>): Promise<ResponseRequest<IRole | null>> {
    try {
        const role = await Role.findOneAndUpdate({ name }, data, { new: true });
        if (!role) return Response(false, null, 404, "Rol no encontrado");
        return Response(true, Class2Json<IRole>(role), 0, "Rol actualizado correctamente");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al actualizar rol");
    }
}

// Obtener un rol por nombre
export async function getRole(name: string): Promise<ResponseRequest<IRole | null>> {
    try {
        const role = await Role.findOne({ name });
        if (!role) return Response(false, null, 404, "Rol no encontrado");
        return Response(true, Class2Json<IRole>(role), 0, "Rol encontrado");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al obtener rol");
    }
};

async function RecursiveExtendsPermissionRole(role: IRole): Promise<PermissionInterface> {

    const roleExtended = await Role.findOne({ name: role.extends });
    let permissionExtended: PermissionInterface = {} as PermissionInterface;
        // console.log([roleExtended, role])
    
    // if (false) 
    if (roleExtended) {
            
            
            
        // console.log([roleExtended])
        permissionExtended = await RecursiveExtendsPermissionRole(
            roleExtended as IRole
        );
    };

    Object.entries(role.permission).forEach(([key, value]: [
        string, 
        ReadOnly_ReadAndWrite|None_ReadOnly_ReadAndWrite
    ]) => {
        if (value !== 0) {
            permissionExtended[key as keyof PermissionInterface] = value as ReadOnly_ReadAndWrite;
        }
    })

    return permissionExtended


}

export async function getRoleAndInstance(name: string): Promise<ResponseRequest<IRole | null>> {
    try {
        const role = await Role.findOne({ name });

        if (!role) return Response(false, null, 404, "Rol no encontrado");

        role.permission = {
            ...(Class2Json<PermissionInterface>(PermissionDefault)),
            ...(await RecursiveExtendsPermissionRole(
                role as IRole
            ))
        }

        return Response(true, Class2Json<IRole>(role), 0, "Rol encontrado");
    } catch (err: any) {
        return Response(false, null, 1, err.message || "Error al obtener rol");
    }
};



// Obtener todos los roles
export async function getAllRoles(): Promise<ResponseRequest<IRole[]>> {
    try {
        const roles = await Role.find();
        return Response(true, Class2Json<IRole[]>(roles), 0, "Roles obtenidos correctamente");
    } catch (err: any) {
        return Response(false, [], 1, err.message || "Error al obtener roles");
    }
}

