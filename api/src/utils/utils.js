class Utils {
    static tiene_datos(objeto) {
        return objeto && Object.values(objeto).some(valor => valor !== null && valor !== undefined);
    }
}

module.exports = Utils;