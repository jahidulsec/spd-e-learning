export const phoneRegex = new RegExp(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/
  );
  
export const timeRegex = new RegExp(
  /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
)