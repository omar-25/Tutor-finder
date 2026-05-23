package com.omar.yaladars.UserManagement;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class UserService implements IUserProfile {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(UUID id, UserDTO dto) {
        User user = getUserById(id);
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}