const users = []

<<<<<<< HEAD
const addUser = (id, username, nicname) => {

    const existingUser = users.find(user => user.id === id)

    if (!existingUser) {

        users.push({ id, username, nicname })
        return id
    } else {
        const index = users.findIndex(user => user.id === id)

        if (index !== -1) users.splice(index, 1)[0]
        users.push({id, username, nicname})
        return id
    }
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) return users.splice(index, 1)[0]
}

const getUser = (id) => users.filter(user => user.id === id)

const getAllUsers = () => users

module.exports = { addUser, removeUser, getUser, getAllUsers }
=======
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
>>>>>>> efe66d1a716871370819c4ed16503398ef4dca9f
