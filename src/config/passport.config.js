//Importacion de estrategias: 
const passport = require("passport");
//const local = require("passport-local");
const jwt = require("passport-jwt");

//Estrategia con GitHub:
const GitHubStrategy = require("passport-github2");

const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");


const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
}



// //Herramienta que me permite instanciar la nueva estrategia 
// const LocalStrategy = local.Strategy;

// const initializePassport = () => {

//     //Armado de estrategia  para registro y login
//     passport.use("register", new LocalStrategy({

//         //Se le dice que se quiere acceder al objeto request
//         passReqToCallback: true,
//         usernameField: "email"
//     }, async (req, username, password, done) => {

//         const { first_name, last_name, email, age } = req.body;

//         try {
//             //Verificacion existencia usuario
//             let user = await UserModel.findOne({ email });

//             if (user) {
//                 return done(null, false);
//             }
//             //En caso de no existir el usuario, se crea un nuevo registro
//             let newUser = {
//                 first_name,
//                 last_name,
//                 email,
//                 age,
//                 password: createHash(password)
//             }

//             let result = await UserModel.create(newUser);
//             return done(null, result);
//             //Se envia done con el usuario generado. 

//         } catch (error) {
//             return done(error);
//         }

//     }))


//     //Estrategia para el "Login"
//     passport.use("login", new LocalStrategy({
//         usernameField: "email"
//     }, async (email, password, done) => {

//         try {
//             //Primero verifico si existe un usuario con ese email: 
//             let user = await UserModel.findOne({ email });

//             if (!user) {
//                 console.log("User not Found");
//                 return done(null, false);
//             }

//             //Si existe verifico la contraseña: 
//             if (!isValidPassword(password, user)) {
//                 return done(null, false);
//             }

//             return done(null, user);


//         } catch (error) {
//             return done(error);
//         }
//     }))

//     //Serializar y deserializar: 

//     passport.serializeUser((user, done) => {
//         done(null, user._id)
//     })

//     passport.deserializeUser(async (id, done) => {
//         let user = await UserModel.findById({ _id: id });
//         done(null, user);
//     })

//GITHUB

passport.use("github", new GitHubStrategy({
    clientID: "Iv23limsXW1UWczWohmA",
    clientSecret: "f60bdaa10455357c96be36f2f9bf43993768ccd7",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
}, async (accessToken, refreshToken, profile, done) => {
    //Veo los datos del perfil
    console.log("Profile:", profile);

    try {
        let user = await UserModel.findOne({ email: profile._json.email });

        if (!user) {
            let newUser = {
                first_name: profile._json.name,
                last_name: "",
                age: 30,
                email: profile._json.email,
                password: ""
            }

            let result = await UserModel.create(newUser);
            done(null, result);

        } else {
            done(null, user);
        }
    } catch (error) {

        return done(error);
    }
}))




//}

module.exports = initializePassport;