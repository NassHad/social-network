module.exports.signUpErrors = (err) => {
    let errors = {pseudo: '', email: '', password: ''}
  // TODO: améliorer ce morceau de code
    if(err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déjà pris";

    if(err.message.includes('email'))
        errors.email = "Email incorrect";

    if(err.message.includes('password'))
        errors.password = "Le mot de passe doit faire 6 caractères minimum";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
        errors.email = "Ce pseudo est déjà pris";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Cet email est déjà enregistré";

    return errors;
}

module.exports.signInErrors = (err) => {
    let errors = {email: '', password: ''}
    console.log(err);
    if(err.message.includes("email"))
        errors.email = "Email inconnu";

    if(err.message.includes("password"))
        errors.password = "Mot de passe incorrect";

    return errors;
}