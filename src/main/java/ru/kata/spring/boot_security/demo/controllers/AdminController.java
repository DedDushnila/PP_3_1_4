package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping
    public String adminPage(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.getAllRoles());
        return "admin";
    }

    @PostMapping("/addUser")
    public String addUser(@RequestParam String username,
                          @RequestParam String name,
                          @RequestParam int age,
                          @RequestParam String password,
                          @RequestParam List<Long> roleIds) {
        Set<Role> roles = roleService.getRolesByIds(roleIds);
        User user = new User();
        user.setUsername(username);
        user.setName(name);
        user.setAge(age);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(roles);

        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/users")
    public String getAllUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users";
    }

    @GetMapping("/updateUser/{id}")
    public String updateUser(@PathVariable("id") Long id, Model model) {
        User user = userService.findUserById(id);
        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("roles", roleService.getAllRoles());
            return "updateUser";
        } else {
            return "redirect:/admin";
        }
    }

    @PostMapping("/updateUser")
    public String updateUser(@RequestParam("id") Long id,
                             @ModelAttribute User user,
                             @RequestParam List<Long> roleIds) {
        userService.updateUser(id, user, roleIds);

        return "redirect:/admin";
    }

    @GetMapping("/deleteUser/{id}")
    public String showDeleteUserForm(@PathVariable("id") Long id, Model model) {
        User user = userService.findUserById(id);
        if (user != null) {
            model.addAttribute("user", user);
            return "deleteUser";
        }
        return "redirect:/admin";
    }

    @PostMapping("/deleteUser")
    public String deleteUser(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}