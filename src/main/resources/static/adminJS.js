let currentUserId = null;
let currentUserEditId = null;


const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));


function loadCurrentUser() {
    fetch('/api/current-user')
        .then(response => response.json())
        .then(user => {
            const currentUserEmail = document.getElementById('currentUserEmail');
            currentUserEmail.textContent = user.email;
            currentUserEmail.dataset.userId = user.id;
            document.getElementById('currentUserRoles').textContent =
                user.roles.map(role => role.name.replace('ROLE_', '')).join(', ');
        })
        .catch(error => {
            console.error('Error loading current user:', error);
        });
}



function loadUsers() {
    fetch('/api/users', {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json();
        })
        .then(users => {
            renderUsersTable(users);
        })
        .catch(error => {
            console.error('Error loading users:', error)
        });
}


document.getElementById('logoutForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/login-page';
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
});


function createCell(content) {
    const td = document.createElement('td');
    td.textContent = content;
    return td;
}


function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');

        tr.appendChild(createCell(user.id));
        tr.appendChild(createCell(user.username));
        tr.appendChild(createCell(user.name));
        tr.appendChild(createCell(user.lastName));
        tr.appendChild(createCell(user.age));
        tr.appendChild(createCell(user.email));
        tr.appendChild(createCell(user.roles.map(role => role.name.replace('ROLE_', '')).join(', ')));

        const editTd = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-primary btn-sm edit-btn';
        editButton.textContent = 'Edit';
        editButton.onclick = () => openEditModal(user.id);
        editTd.appendChild(editButton);
        tr.appendChild(editTd);

        const deleteTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => openDeleteModal(user.id);
        deleteTd.appendChild(deleteButton);
        tr.appendChild(deleteTd);

        tbody.appendChild(tr);
    });
}



function loadUserInfo() {
    fetch('/api/current-user', {
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(user => {
            const tbody = document.getElementById('currentUserTableBody');
            tbody.innerHTML = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roles.map(role => role.name.replace('ROLE_', '')).join(', ')}</td>
            </tr>
        `;
        })
        .catch(error => {
            console.error('Error loading user info:', error);
        });
}


async function loadRoles() {
    try {
        const response = await fetch('/api/roles', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const roles = await response.json();
        return roles;
    } catch (error) {
        console.error('Error loading roles:', error);
        return [];
    }
}

async function openEditModal(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await response.json();
        currentUserEditId = userId;

        const form = document.getElementById('editUserForm');

        const idField = form.querySelector('input[type="hidden"][name="id"]');
        if (!idField) throw new Error('Hidden ID field not found');
        idField.value = userId;

        form.querySelector('input[type="text"][id="displayUserId"]').value = userId;
        form.querySelector('input[name="username"]').value = user.username;
        form.querySelector('input[name="name"]').value = user.name;
        form.querySelector('input[name="lastName"]').value = user.lastName;
        form.querySelector('input[name="age"]').value = user.age;
        form.querySelector('input[name="email"]').value = user.email;
        form.querySelector('input[name="password"]').value = '';

        const roleSelect = form.querySelector('select[name="roles"]');
        roleSelect.innerHTML = '';

        const roles = await loadRoles();
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name.replace('ROLE_', '');

            if (user.roles.some(userRole => userRole.id === role.id)) {
                option.selected = true;
            }
            roleSelect.appendChild(option);
        });

        editModal.show();
    } catch (error) {
        console.error('Error opening edit modal:', error);
        alert('Error loading user data. Please try again.');
    }
}



async function openDeleteModal(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await response.json();
        currentUserId = userId;

        const form = document.getElementById('deleteUserForm');
        form.querySelector('input[type="hidden"][name="id"]').value = userId;
        form.querySelector('input[type="text"][name="id"]').value = userId;
        form.querySelector('input[name="username"]').value = user.username;
        form.querySelector('input[name="name"]').value = user.name;
        form.querySelector('input[name="lastName"]').value = user.lastName;
        form.querySelector('input[name="age"]').value = user.age;
        form.querySelector('input[name="email"]').value = user.email;

        deleteModal.show();
    } catch (error) {
        console.error('Error opening delete modal:', error);
        alert('Error loading user data. Please try again.');
    }
}


async function handleEditUserSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userId = formData.get('id');
    const currentUserId = document.getElementById('currentUserEmail').dataset.userId;

    const rolesSelect = event.target.querySelector('select[name="roles"]');

    const selectedRoles = Array.from(rolesSelect.selectedOptions).map(option => parseInt(option.value));

    const userData = {
        id: parseInt(userId),
        username: formData.get('username'),
        name: formData.get('name'),
        lastName: formData.get('lastName'),
        age: formData.get('age'),
        email: formData.get('email'),
        password: formData.get('password') || null,
        roles: selectedRoles
    };

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });

        const responseText = await response.text();
        if (!response.ok) {
            throw new Error(`Error updating user: ${responseText}`);
        }

        editModal.hide();
        await loadUsers();

        if (userId === currentUserId && currentUserId) {
            const hasAdminRole = selectedRoles.some(role => role.name === 'ADMIN' || role.name === 'ROLE_ADMIN');
            window.location.href = hasAdminRole ? '/admin.html' : '/user.html';
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error updating user. Please try again.');
    }
}



async function handleDeleteUserSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userId = formData.get('id');

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error deleting user');
        }

        deleteModal.hide();

        await loadUsers();

        if (userId === document.getElementById('currentUserEmail').dataset.userId) {
            window.location.href = '/login-page';
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
    }
}


async function handleNewUserSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const rolesSelect = event.target.querySelector('select[name="roles"]');


    const selectedRoleIds = Array.from(rolesSelect.selectedOptions).map(option => parseInt(option.value));

    const newUser = {
        username: formData.get('username'),
        name: formData.get('name'),
        lastName: formData.get('lastName'),
        age: parseInt(formData.get('age')),
        email: formData.get('email'),
        password: formData.get('password'),
        roles: selectedRoleIds
    };

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newUser)
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Error creating user: ${responseText}`);
        }


        event.target.reset();
        await loadUsers();

    } catch (error) {
        console.error('Error creating user:', error);
        alert(`Error creating user: ${error.message}`);
    }
}



async function loadRolesToSelect() {
    try {
        console.log('Loading roles into New User form...');
        const response = await fetch('/api/roles', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to load roles');
        }

        const roles = await response.json();
        console.log('Roles received:', roles);

        const rolesSelect = document.querySelector('#newUserForm select[name="roles"]');
        if (!rolesSelect) {
            console.error(' Не найден select[name="roles"] внутри newUserForm');
            return;
        }

        rolesSelect.innerHTML = '';
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name.replace('ROLE_', '');
            rolesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading roles:', error);
    }
}



document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadCurrentUser();
        await loadUsers();
        await loadUserInfo();
        await loadRolesToSelect();

        // Проверка наличия элементов перед обработкой событий
        const editUserForm = document.getElementById('editUserForm');
        if (editUserForm) {
            editUserForm.addEventListener('submit', handleEditUserSubmit);
        }

        const deleteUserForm = document.getElementById('deleteUserForm');
        if (deleteUserForm) {
            deleteUserForm.addEventListener('submit', handleDeleteUserSubmit);
        }

        const newUserForm = document.getElementById('newUserForm');
        if (newUserForm) {
            newUserForm.addEventListener('submit', handleNewUserSubmit);
        }
    } catch (error) {
        console.error('Ошибка инициализации страницы:', error);
    }
});