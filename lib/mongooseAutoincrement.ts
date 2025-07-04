import { Schema, Document, Model, Connection } from 'mongoose';

// 1. Definición del Esquema y Modelo para los Contadores
// ---
interface ICounter extends Document {
  _id: string; // Nombre del modelo o colección para el que estamos contando
  seq: number; // El valor actual del contador
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Usamos Connection.model para evitar errores de redefinición en entornos con hot-reloading
// o cuando el plugin se aplica múltiples veces en el mismo contexto.
let CounterModel: Model<ICounter>;

export function initializeCounterModel(connection: Connection): Model<ICounter> {
  if (!connection.models.Counter) {
    CounterModel = connection.model<ICounter>('Counter', CounterSchema);
  } else {
    CounterModel = connection.models.Counter as Model<ICounter>;
  }
  return CounterModel;
}

// 2. Interfaz para las Opciones del Plugin
// ---
interface AutoIncrementOptions {
  field: string; // El nombre del campo a autoincrementar (ej. 'userId')
  model?: string; // Nombre del modelo para el cual se autoincrementará el campo (opcional)
  connection?: Connection; // Conexión de Mongoose si se usa una conexión secundaria (opcional)
}

// 3. El Plugin de Autoincremento
// ---
/**
 * Plugin de Mongoose para autoincrementar campos, comúnmente usado para claves primarias.
 *
 * @param {Schema} schema - El esquema de Mongoose al que se aplica el plugin.
 * @param {AutoIncrementOptions} options - Opciones del plugin.
 * @param {string} options.field - El nombre del campo a autoincrementar.
 * @param {string} [options.model] - El nombre del modelo para el cual se autoincrementará el campo.
 * @param {Connection} [options.connection] - Una instancia de conexión de Mongoose si se necesita un modelo Counter en una conexión específica.
 */
export function autoIncrement<T extends Document>(
  schema: Schema<T>,
  options: AutoIncrementOptions
) {
  const { field, model, connection } = options;

  if (!field) {
    throw new Error('El plugin autoIncrement requiere la opción "field".');
  }

  // Obtener el modelo de Counter. Si se proporciona una conexión, úsala, de lo contrario, usa la conexión global.
  const counterMongooseModel: Model<ICounter> = connection
    ? initializeCounterModel(connection)
    : CounterModel || initializeCounterModel(require('mongoose')); // Fallback si no se inicializa globalmente

  // Antes de guardar un nuevo documento
  schema.pre<T>('save', async function (next) {
    // Si el documento es nuevo y el campo no está definido (o es 0), lo autoincrementamos
    if (this.isNew && (!this[field as keyof T] || (this[field as keyof T] as any) === 0)) {
      // Determina el nombre de la colección/modelo para el contador
      const collectionName = model || (this.constructor as any).modelName || this.collection.name;

      try {
        const counter = await counterMongooseModel.findByIdAndUpdate(
          collectionName,
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );

        if (counter) {
          (this as any)[field] = counter.seq; // Asigna el valor autoincrementado
        } else {
          // Esto no debería suceder con upsert: true, pero es una buena práctica para TS
          next(new Error(`No se pudo obtener o crear el contador para '${collectionName}'.`));
          return;
        }
        next();
      } catch (error: any) {
        next(error);
      }
    } else {
      next();
    }
  });
}