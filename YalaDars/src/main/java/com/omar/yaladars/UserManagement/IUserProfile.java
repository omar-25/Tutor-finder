package com.omar.yaladars.UserManagement;

import java.util.List;
import java.util.UUID;

public interface IUserProfile {

    User getUserById(UUID id);
    User getUserByEmail(String email);
    List<User> getAllUsers();
    User updateUser(UUID id, UserDTO dto);
    void deleteUser(UUID id);
}