'use strict';

class File {
    constructor(name, permission) {
        this.name = name;
        this.permission = permission;
    }
}

class Permission {
    constructor(id) {
        this.id = id;
    }
}

class Role {
    constructor(id, permissions) {
        this.id = id;
        this.permissions = permissions;
    }
}

class User {
    constructor(name, roles) {
        this.name = name;
        this.roles = roles;
    }
}

module.exports = {
    File: File,
    Permission: Permission, 
    User: User, 
    Role:Role,
};