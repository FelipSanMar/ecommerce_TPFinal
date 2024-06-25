const generarInfoError = (product) => {
    return ` Los datos estan incompletos o no son válidos. 
    Necesitamos recibir los siguientes datos: 
    - TITLE:       String  | Ingreso: ${product.title}
    - PRICE:       String  | Ingreso: ${product.price}
    - CATEGORY:    String  | Ingreso: ${product.category}
    - CODE:        String  | Ingreso: ${product.code}
    - DESCRIPTION: String  | Ingreso: ${product.description}
    `
}

module.exports = {
    generarInfoError
}