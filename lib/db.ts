import mongoose, { model, connect, Schema, Model, RootFilterQuery } from "mongoose";
import { autoIncrement, initializeCounterModel } from "./mongooseAutoincrement";
import { IMarker, IMinute, IMinuteType, IOrigins, IOriginsElement, IRole, IUser } from "./db-types"
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
}
mongoose.connect(process.env.MONGO_URI as string, {bufferCommands: false});
// En tu archivo de conexión a la base de datos
// mongoose.set('strictQuery', true);

const UserSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true,
    },
    role: String,
});

const MinuteTypeSchema = new Schema({
    id: Number,
    caption: String,
    typeName: {
        type: String,
        unique: true,
    },
    fields: Array
});

const MarkerSchema = new Schema({
    id: Number,
    subject: String,
    description: String,
    reference: String,
    report_date: {
        type: Date,
        required: true,
    },
    lng: Number,
    lat: Number,
});

// Aplica el plugin de autoincremento al campo 'id' de Marker
autoIncrement(MarkerSchema, { field: "id", model: "Marker" });

const MinuteSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    type: String,
    marker_id: Number,
    // fields: {
    //     type: Object,
    //     default: {},
    // }
    fields: {
        type: Schema.Types.Mixed,
        default: {},
        minimize: false,
        strict: false,
    }
}, { strict: false });

const RoleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    extends: String,
    title: String,
    disabled: Boolean,
    permission: {
        type: Schema.Types.Mixed,
        default: {},
        minimize: false,
        strict: false,
    }
}, { strict: false })

const OriginSchema = new Schema<IOrigins>({
    disabled: Boolean,
    id: Number,
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: String
});

const OriginElementSchema = new Schema<IOriginsElement>({
    id: Number,
    title: String,
    origins: String,
    peso: Number,
    value: {
        type: String,
        required: true,
        unique: true
    },
    disabled: Boolean
});



// Aplica el plugin de autoincremento al campo 'id' de SimpleMinute
autoIncrement(MinuteSchema, { field: "id", model: "Minute" });
autoIncrement(MinuteTypeSchema, { field: "id", model: "MinuteType" });
autoIncrement(OriginSchema as any, { field: "id", model: "Origins" });
autoIncrement(OriginElementSchema as any, { field: "id", model: "OriginsElement" });

function ExportModel<T = Document>(nameModel: string, schema: Schema): Model<T> {

    const MODEL: Model<T> =
        (mongoose.models[nameModel] as Model<T>) || mongoose.model<T>(nameModel, schema);

    return MODEL
}

// Evita la recompilación de modelos en desarrollo con Next.js

export const User = ExportModel<IUser>("User", UserSchema);
export const Marker = ExportModel<IMarker>("Marker", MarkerSchema);
export const Minute = ExportModel<IMinute>("Minute", MinuteSchema);
export const MinuteType = ExportModel<IMinuteType>("MinuteType", MinuteTypeSchema);
export const Role = ExportModel<IRole>("Role", RoleSchema);
export const Origin = ExportModel<IOrigins>("Origin", OriginSchema);
export const OriginElement = ExportModel<IOriginsElement>("OriginElement", OriginElementSchema);
