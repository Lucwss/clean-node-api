export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://user-access:user-pass-123@0.0.0.0:27040/?authMechanism=DEFAULT',
    port: process.env.PORT || 5050
}
