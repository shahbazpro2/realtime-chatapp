const users = []

function addUser(id) {
    const existingUser = users.find(user => user === id)
    if (!existingUser) {
        users.push(id)
        return id
    } else {
        const index = users.findIndex(user => user === id)
        if (index !== -1) users.splice(index, 1)[0]
        users.push(id)
        return id
    }

}

function removeUser(id) {
    const index = users.findIndex(user => user === id)
    if (index !== -1) return users.splice(index, 1)[0]
}

function getUser(id) {
    return users.find(user => user === id);
}

function getAllUsers() {
    return users;
}

module.exports = {addUser, removeUser, getUser, getAllUsers}
