exports.getUser = (name, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(1);
        }
        catch(exception) {
            reject(exception);
        }
    });
}
