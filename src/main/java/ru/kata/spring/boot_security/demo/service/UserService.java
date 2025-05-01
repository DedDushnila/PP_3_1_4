package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.models.User;
import java.util.List;

public interface UserService {
    User findUserById(Long id); // Получение пользователя по ID
    List<User> getAllUsers(); // Получение списка всех пользователей
    void saveUser(User user); // Сохранение нового пользователя
    void updateUser(User user); // Обновление существующего пользователя
    boolean deleteUser(Long id);
    void updateUser(Long id, User updateUser, List<Long> roleIds);

}