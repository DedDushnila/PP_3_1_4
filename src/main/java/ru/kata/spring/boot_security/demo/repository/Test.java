package ru.kata.spring.boot_security.demo.repository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.Set;

@Component
public class Test implements CommandLineRunner {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public Test(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Override
    public void run(String... args) throws Exception {

        Role roleUser = new Role("ROLE_USER");
        Role roleAdmin = new Role("ROLE_ADMIN");

        roleService.saveRole(roleUser);
        roleService.saveRole(roleAdmin);


        User user = new User();
        user.setUsername("user");
        user.setPassword("user");
        user.setName("Regular");
        user.setLastName("User");
        user.setAge(25);
        user.setEmail("user@email.ru");
        user.setRoles(Set.of(roleUser));

        userService.saveUser(user);


        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("admin");
        admin.setName("Admin");
        admin.setLastName("Administrator");
        admin.setAge(30);
        admin.setEmail("admin@email.ru");
        admin.setRoles(Set.of(roleAdmin));

        userService.saveUser(admin);

        System.out.println("тест БД ок");
    }
}