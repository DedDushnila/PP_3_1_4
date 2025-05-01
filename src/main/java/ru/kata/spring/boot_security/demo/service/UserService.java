package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.models.User;
import java.util.List;

public interface UserService {
    User findUserById(Long id);
    List<User> getAllUsers();
    void saveUser(User user);
    void updateUser(User user);
    boolean deleteUser(Long id);
    void updateUser(Long id, User updateUser, List<Long> roleIds);

}