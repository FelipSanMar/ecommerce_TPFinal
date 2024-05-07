const bcrypt = require("bcrypt");

//Se le aplica el hash al password. El proceso que se realiza es irreversible
//hashSync: Tomas el password pasado y a partir de un "salt" aplica el proceso de hasheo.
//"salt" es un string random el cual permite que el proceso de hasheo se realice de forma impredecible.

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//isValidPassword: Se compara el password proporcionado con el usuario, con el de la base de datos 

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

module.exports = {
    createHash,
    isValidPassword
}