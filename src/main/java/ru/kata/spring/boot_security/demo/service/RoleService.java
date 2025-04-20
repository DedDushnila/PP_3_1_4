package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.models.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {
    Set<Role> getRoleByUserId(Long id); // Получение ролей пользователя по ID
    List<Role> getAllRoles(); // Получение всех ролей
    Set<Role> getRolesByIds(List<Long> ids); // Поиск ролей по списку ID
    Role saveRole(Role role);
}