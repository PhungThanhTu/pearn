module.exports = {
    getRole: (req) => {
        return req.user.role;
    }
}