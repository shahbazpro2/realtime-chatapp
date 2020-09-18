const users = []

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