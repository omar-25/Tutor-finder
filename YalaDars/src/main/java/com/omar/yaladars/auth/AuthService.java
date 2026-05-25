package com.omar.yaladars.auth;

import com.omar.yaladars.UserManagement.Role;
import com.omar.yaladars.UserManagement.User;
import com.omar.yaladars.UserManagement.UserRepository;
import com.omar.yaladars.tutor.Tutor;
import com.omar.yaladars.tutor.TutorProfileRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class AuthService implements IAuth {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TutorProfileRepository tutorRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       TutorProfileRepository tutorRepository) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService      = jwtService;
        this.tutorRepository = tutorRepository;
    }
    @Override
    @Transactional
    public AuthResponse register(Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());

        userRepository.save(user);

        // Create a linked Tutor profile when registering as a TUTOR
        if (request.getRole() == Role.TUTOR) {
            Tutor tutor = new Tutor();
            tutor.setSubjects(new ArrayList<>());
            tutor.setHourlyRate(0.0);
            tutor.setBio("");
            tutorRepository.save(tutor);
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    @Override
    public AuthResponse login(Login request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }
}
