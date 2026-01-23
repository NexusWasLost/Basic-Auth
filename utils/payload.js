export function createPayload(id, email){
    return {
        sub: id,
        email: email
    }
}
