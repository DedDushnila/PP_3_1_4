package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@RestController
@RequestMapping("/api")
public class CurrentUserControllerREST {

    private final UserService userService;

    @Autowired
    public CurrentUserControllerREST(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/user")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User user = userService.findUserByUsername(authentication.getName());
        return ResponseEntity.ok(user);
    }
}