package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.dto.UserDTO;
import ru.kata.spring.boot_security.demo.models.User;
import java.util.List;

public interface UserService {
    User findUserByUsername(String username);
    List<User> getAllUsers();
    void saveUser(User user);
    boolean deleteUser(Long id);
    void updateUser(Long id, UserDTO userDto);
    User getUserById(Long id);
    void updatedUser(Long id, User updatedUser, List<Long> roleIds);
    User createUserFromDto(UserDTO userDto);
}