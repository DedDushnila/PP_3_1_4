package ru.kata.spring.boot_security.demo.controllers;

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

    public AdminController( UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String adminPage(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.getAllRoles());
        return "admin";
    }

    @GetMapping("/addUser")
    public String showAddUserForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getAllRoles());
        return "addUser";
    }
    @PostMapping("/addUser")
    public String addUser(@ModelAttribute User user,@RequestParam List<Long> roleIds) {
        Set<Role> roles = roleService.getRolesByIds(roleIds);
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
        User existingUser = userService.findUserById(id);

        if (existingUser != null) {
            existingUser.setName(user.getName());
            existingUser.setLastName(user.getLastName());
            existingUser.setAge(user.getAge());
            existingUser.setUsername(user.getUsername());

            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                existingUser.setPassword(existingUser.getPassword());
            }

            existingUser.setRoles(roleService.getRolesByIds(roleIds));

            userService.updateUser(existingUser);
        }
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
        return userService.deleteUser(id);
    }

}