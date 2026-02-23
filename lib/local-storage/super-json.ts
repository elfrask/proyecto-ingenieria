function encode(this: any, key: string, postValue: any): any {
  // console.log(key, "es Date y tiene por valor", value)

  const value = this[key]; 
  // Buffer.from(value, "base64")

  if (value instanceof Date) {
    // alert(key + ` Es Date`)

    return { _type: "Date", value: value.toISOString() };
  }
  if (value instanceof File) {
    return { _type: "File", name: value.name, size: value.size, type: value.type, src: "" };
  }
  if (value instanceof Map) {
    return { _type: "Map", value: Array.from(value.entries()) };
  }
  return value;
}

function decode(key: string, value: any): any {
  if (value && value._type === "Date") {
    return new Date(value.value);
  }
  if (value && value._type === "File") {
    // File reconstruction is limited in JavaScript; this is a placeholder.
    return new File([], value.name, { type: value.type });
  }
  if (value && value._type === "Map") {
    return new Map(value.value);
  }
  return value;
}

export const Encode = (value: any) => JSON.stringify(value, encode);

export const Decode = (value: string) => JSON.parse(value, decode);