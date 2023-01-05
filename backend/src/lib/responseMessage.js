

module.exports = {
    handleCreated: (res,data) => res.status(201).json(data),
    handleBadRequest: (res,err) => res.status(400).json(err),
    handleOk: (res,data) => res.status(200).json(data),
    handleNotFound: (res,err) => res.status(404).json(err),
    handleNotAllowed: (res) => res.status(405).json("No permission"),
    validateGuid: (value) => value.match(/^[0-9a-fA-F]{24}$/) || false
}